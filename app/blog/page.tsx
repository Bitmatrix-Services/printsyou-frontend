import {BlogsComponent} from '@components/blog/blogs.component';
import {getAllBlogs} from '@components/blog/blog-apis';
import {Blog} from '@components/blog/type';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const BlogsPage = async () => {
  const response = await getAllBlogs();

  let allBlogs: Blog[] = [];

  if (response?.payload) allBlogs = response.payload;

  return <BlogsComponent allBlogs={allBlogs} />;
};

export default BlogsPage;

export const metadata: Metadata = {
  title: `Blogs | ${metaConstants.SITE_NAME}`,
  description: `Stay updated with the latest trends, tips, and insights in the world of promotional products. Explore our blog for creative ideas, industry news, and expert advice to boost your brand's visibility.`,
  alternates: {
    canonical: `${process.env.FE_URL}blog`
  }
};
