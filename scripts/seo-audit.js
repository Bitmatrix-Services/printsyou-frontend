#!/usr/bin/env node
/**
 * SEO Audit Script
 *
 * Calls backend SEO audit endpoints and generates comprehensive report.
 *
 * Usage:
 *   node scripts/seo-audit.js [--backend-url=http://localhost:8080] [--output=./seo-audit-report]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const DEFAULT_OUTPUT_DIR = './seo-audit-output';

// Parse command line arguments
function parseArgs() {
    const args = {
        backendUrl: DEFAULT_BACKEND_URL,
        outputDir: DEFAULT_OUTPUT_DIR
    };

    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--backend-url=')) {
            args.backendUrl = arg.split('=')[1];
        } else if (arg.startsWith('--output=')) {
            args.outputDir = arg.split('=')[1];
        }
    });

    return args;
}

// HTTP request helper
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
                }
            });
        }).on('error', reject);
    });
}

function fetchText(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Parse CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = parseCSVLine(lines[0]);

    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const row = {};
        headers.forEach((header, i) => {
            row[header] = values[i] || '';
        });
        return row;
    });
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Main audit function
async function runAudit(config) {
    console.log('\n🔍 SEO Audit Script');
    console.log('===================\n');
    console.log(`Backend URL: ${config.backendUrl}`);
    console.log(`Output Directory: ${config.outputDir}\n`);

    // Create output directory
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
    }

    const report = {
        generatedAt: new Date().toISOString(),
        backendUrl: config.backendUrl,
        summary: null,
        validationReport: null,
        csvData: [],
        checks: {
            indexPagesWithZeroProducts: [],
            indexPagesWithLowProducts: [],
            noindexWithInconsistentCanonical: [],
            noindexInSitemap: [],
            invalidCanonicalDomain: [],
            invalidCanonicalUrls: [],
            duplicateSitemapUrls: [],
            illegalUrlChars: []
        },
        recommendations: []
    };

    try {
        // 1. Fetch summary
        console.log('📊 Fetching summary...');
        report.summary = await fetchJson(`${config.backendUrl}/api/admin/seo-audit/summary`);
        console.log(`   Total categories: ${report.summary.totalCategories}`);
        console.log(`   INDEX: ${report.summary.totalIndex}`);
        console.log(`   NOINDEX: ${report.summary.totalNoIndex}`);

        // 2. Fetch full validation report
        console.log('\n✅ Running full validation...');
        report.validationReport = await fetchJson(`${config.backendUrl}/api/admin/seo-audit/validate`);
        console.log(`   Overall Status: ${report.validationReport.overallStatus}`);
        console.log(`   Critical Issues: ${report.validationReport.criticalIssues}`);
        console.log(`   Warnings: ${report.validationReport.warnings}`);

        // 3. Fetch CSV report and parse
        console.log('\n📄 Fetching CSV report...');
        const csvText = await fetchText(`${config.backendUrl}/api/admin/seo-audit/full-report`);
        report.csvData = parseCSV(csvText);
        console.log(`   Parsed ${report.csvData.length} categories`);

        // Save CSV
        fs.writeFileSync(path.join(config.outputDir, 'full-report.csv'), csvText);

        // 4. Run additional checks on CSV data
        console.log('\n🔎 Running additional checks...');

        for (const row of report.csvData) {
            const url = row['URL'] || '';
            const productCount = parseInt(row['Product Count']) || 0;
            const seoIndexable = row['SEO Indexable'];
            const reasonCode = row['Reason Code'];
            const absorptionParent = row['Absorption Parent Slug'];
            const canonicalToParent = row['Canonical To Parent'] === 'true';
            const canonicalUrl = row['Final Canonical URL'] || '';

            // Check: INDEX pages with 0 products
            if (seoIndexable === 'INDEX' && productCount === 0) {
                report.checks.indexPagesWithZeroProducts.push({
                    url,
                    productCount,
                    reasonCode,
                    severity: 'CRITICAL'
                });
            }

            // Check: INDEX pages with < 5 products
            if (seoIndexable === 'INDEX' && productCount > 0 && productCount < 5) {
                report.checks.indexPagesWithLowProducts.push({
                    url,
                    productCount,
                    reasonCode,
                    severity: 'WARNING'
                });
            }

            // Check: NOINDEX with absorption parent but not canonical to parent
            if (seoIndexable === 'NOINDEX' && absorptionParent && !canonicalToParent) {
                report.checks.noindexWithInconsistentCanonical.push({
                    url,
                    absorptionParent,
                    canonicalToParent,
                    severity: 'WARNING'
                });
            }

            // Check: Canonical URL not on correct domain
            if (!canonicalUrl.startsWith('https://printsyou.com')) {
                report.checks.invalidCanonicalDomain.push({
                    url,
                    canonicalUrl,
                    severity: 'CRITICAL'
                });
            }

            // Check: Localhost in URL
            if (url.includes('localhost') || canonicalUrl.includes('localhost')) {
                report.checks.invalidCanonicalUrls.push({
                    url,
                    canonicalUrl,
                    issue: 'Contains localhost',
                    severity: 'CRITICAL'
                });
            }

            // Check: Illegal characters
            if (url.match(/[<>"'`\s]/) || url.includes('//categories')) {
                report.checks.illegalUrlChars.push({
                    url,
                    severity: 'WARNING'
                });
            }
        }

        // Check for duplicate URLs
        const urlCounts = {};
        for (const row of report.csvData) {
            const url = row['URL'];
            urlCounts[url] = (urlCounts[url] || 0) + 1;
        }
        for (const [url, count] of Object.entries(urlCounts)) {
            if (count > 1) {
                report.checks.duplicateSitemapUrls.push({ url, count, severity: 'WARNING' });
            }
        }

        // 5. Generate recommendations
        console.log('\n💡 Generating recommendations...');

        if (report.checks.indexPagesWithZeroProducts.length > 0) {
            report.recommendations.push({
                priority: 'HIGH',
                issue: `${report.checks.indexPagesWithZeroProducts.length} INDEX pages have 0 products`,
                action: 'Either add products to these pages or set them to NOINDEX'
            });
        }

        if (report.checks.invalidCanonicalDomain.length > 0) {
            report.recommendations.push({
                priority: 'CRITICAL',
                issue: `${report.checks.invalidCanonicalDomain.length} pages have canonical URLs not on printsyou.com`,
                action: 'Update frontend URL configuration to use production domain'
            });
        }

        if (report.checks.noindexWithInconsistentCanonical.length > 0) {
            report.recommendations.push({
                priority: 'MEDIUM',
                issue: `${report.checks.noindexWithInconsistentCanonical.length} NOINDEX pages have absorption parent but self-canonical`,
                action: 'Consider setting canonicalToParent=true to consolidate link equity'
            });
        }

        // 6. Generate markdown report
        console.log('\n📝 Generating markdown report...');
        const markdown = generateMarkdownReport(report);
        fs.writeFileSync(path.join(config.outputDir, 'seo-audit-report.md'), markdown);

        // 7. Save JSON report
        fs.writeFileSync(
            path.join(config.outputDir, 'seo-audit-report.json'),
            JSON.stringify(report, null, 2)
        );

        // 8. Print summary
        console.log('\n' + '='.repeat(60));
        console.log('AUDIT COMPLETE');
        console.log('='.repeat(60));
        console.log(`\nOverall Status: ${getStatusEmoji(report.validationReport.overallStatus)} ${report.validationReport.overallStatus}`);
        console.log(`\nCritical Issues: ${report.validationReport.criticalIssues}`);
        console.log(`Warnings: ${report.validationReport.warnings}`);
        console.log(`\nChecks Summary:`);
        console.log(`  - INDEX pages with 0 products: ${report.checks.indexPagesWithZeroProducts.length}`);
        console.log(`  - INDEX pages with 1-4 products: ${report.checks.indexPagesWithLowProducts.length}`);
        console.log(`  - Inconsistent canonicals: ${report.checks.noindexWithInconsistentCanonical.length}`);
        console.log(`  - Invalid canonical domains: ${report.checks.invalidCanonicalDomain.length}`);
        console.log(`  - Duplicate URLs: ${report.checks.duplicateSitemapUrls.length}`);
        console.log(`\nOutput files saved to: ${config.outputDir}/`);
        console.log(`  - seo-audit-report.md`);
        console.log(`  - seo-audit-report.json`);
        console.log(`  - full-report.csv`);

        // Return exit code based on status
        if (report.validationReport.overallStatus === 'FAIL') {
            console.log('\n❌ Audit FAILED - Critical issues found');
            process.exit(1);
        } else if (report.validationReport.overallStatus === 'WARN') {
            console.log('\n⚠️ Audit completed with WARNINGS');
            process.exit(0);
        } else {
            console.log('\n✅ Audit PASSED');
            process.exit(0);
        }

    } catch (error) {
        console.error('\n❌ Audit failed with error:', error.message);
        console.error('\nMake sure the backend is running and accessible at:', config.backendUrl);
        process.exit(1);
    }
}

function generateMarkdownReport(report) {
    let md = '';

    md += '# SEO Audit Report\n\n';
    md += `**Generated:** ${report.generatedAt}\n\n`;
    md += `**Backend:** ${report.backendUrl}\n\n`;
    md += `**Overall Status:** ${getStatusEmoji(report.validationReport.overallStatus)} ${report.validationReport.overallStatus}\n\n`;

    md += '## Summary\n\n';
    md += '| Metric | Value |\n';
    md += '|--------|-------|\n';
    md += `| Total Categories | ${report.summary.totalCategories} |\n`;
    md += `| INDEX | ${report.summary.totalIndex} |\n`;
    md += `| NOINDEX | ${report.summary.totalNoIndex} |\n`;
    md += `| Index Percentage | ${report.summary.indexPercentage} |\n`;
    md += `| Critical Issues | ${report.validationReport.criticalIssues} |\n`;
    md += `| Warnings | ${report.validationReport.warnings} |\n\n`;

    md += '### By Reason Code\n\n';
    md += '| Reason | Count |\n';
    md += '|--------|-------|\n';
    for (const [reason, count] of Object.entries(report.summary.byReasonCode || {})) {
        md += `| ${reason} | ${count} |\n`;
    }
    md += '\n';

    // Validation sections
    if (report.validationReport.sitemapValidation) {
        md += formatValidationSection(report.validationReport.sitemapValidation);
    }
    if (report.validationReport.canonicalValidation) {
        md += formatValidationSection(report.validationReport.canonicalValidation);
    }
    if (report.validationReport.thinContentValidation) {
        md += formatValidationSection(report.validationReport.thinContentValidation);
    }
    if (report.validationReport.consistencyValidation) {
        md += formatValidationSection(report.validationReport.consistencyValidation);
    }

    // Additional checks
    md += '## Additional Checks\n\n';

    if (report.checks.indexPagesWithZeroProducts.length > 0) {
        md += '### 🔴 INDEX Pages with 0 Products (CRITICAL)\n\n';
        md += '| URL | Reason |\n';
        md += '|-----|--------|\n';
        for (const item of report.checks.indexPagesWithZeroProducts.slice(0, 20)) {
            md += `| ${item.url} | ${item.reasonCode} |\n`;
        }
        if (report.checks.indexPagesWithZeroProducts.length > 20) {
            md += `| ... | _${report.checks.indexPagesWithZeroProducts.length - 20} more_ |\n`;
        }
        md += '\n';
    }

    if (report.checks.indexPagesWithLowProducts.length > 0) {
        md += '### 🟡 INDEX Pages with 1-4 Products (WARNING)\n\n';
        md += '| URL | Product Count | Reason |\n';
        md += '|-----|---------------|--------|\n';
        for (const item of report.checks.indexPagesWithLowProducts.slice(0, 20)) {
            md += `| ${item.url} | ${item.productCount} | ${item.reasonCode} |\n`;
        }
        if (report.checks.indexPagesWithLowProducts.length > 20) {
            md += `| ... | ... | _${report.checks.indexPagesWithLowProducts.length - 20} more_ |\n`;
        }
        md += '\n';
    }

    if (report.checks.noindexWithInconsistentCanonical.length > 0) {
        md += '### 🟡 NOINDEX with Inconsistent Canonical\n\n';
        md += '| URL | Absorption Parent | Canonical To Parent |\n';
        md += '|-----|-------------------|---------------------|\n';
        for (const item of report.checks.noindexWithInconsistentCanonical.slice(0, 20)) {
            md += `| ${item.url} | ${item.absorptionParent} | ${item.canonicalToParent} |\n`;
        }
        md += '\n';
    }

    // Recommendations
    if (report.recommendations.length > 0) {
        md += '## Recommendations\n\n';
        for (const rec of report.recommendations) {
            const emoji = rec.priority === 'CRITICAL' ? '🔴' : rec.priority === 'HIGH' ? '🟠' : '🟡';
            md += `### ${emoji} ${rec.priority}: ${rec.issue}\n\n`;
            md += `**Action:** ${rec.action}\n\n`;
        }
    }

    return md;
}

function formatValidationSection(section) {
    if (!section) return '';

    let md = `## ${section.name}\n\n`;
    md += `**Status:** ${getStatusEmoji(section.status)} ${section.status}\n\n`;

    if (!section.issues || section.issues.length === 0) {
        md += 'No issues found.\n\n';
        return md;
    }

    md += '| Severity | Category | Issue | Recommendation |\n';
    md += '|----------|----------|-------|----------------|\n';

    const limit = 15;
    let count = 0;
    for (const issue of section.issues) {
        if (count >= limit) {
            md += `| ... | ... | _${section.issues.length - limit} more issues_ | ... |\n`;
            break;
        }
        const emoji = issue.severity === 'CRITICAL' ? '🔴' : issue.severity === 'WARNING' ? '🟡' : '🔵';
        md += `| ${emoji} ${issue.severity} | ${truncate(issue.category, 25)} | ${issue.issue} | ${truncate(issue.recommendation, 35)} |\n`;
        count++;
    }
    md += '\n';

    return md;
}

function getStatusEmoji(status) {
    switch (status) {
        case 'PASS': return '✅';
        case 'WARN': return '⚠️';
        case 'FAIL': return '❌';
        default: return '❓';
    }
}

function truncate(str, maxLen) {
    if (!str) return '';
    return str.length > maxLen ? str.substring(0, maxLen - 3) + '...' : str;
}

// Run the audit
const config = parseArgs();
runAudit(config);
