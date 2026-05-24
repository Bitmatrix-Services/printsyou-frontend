import React, {FC} from 'react';
import {convertDateFormat} from '@utils/utils';
import {Blog} from '@components/blog/type';
import {notFound} from 'next/navigation';
import {Container} from '@components/globals/container.component';
import {Avatar, AvatarGroup, CardContent, Grid, Stack} from '@mui/joy';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';

interface IBlogDetailsComponent {
  blog: Blog | null;
}

export const BlogDetailsComponent: FC<IBlogDetailsComponent> = ({blog}) => {
  if (!blog) notFound();
  return (
    <div className="bg-white py-8 lg:py-16">
      <Container>
        <article className="max-w-4xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
              {blog?.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-4">{blog.tagline}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
              <span>Last Modified: {convertDateFormat(blog.modifiedAt)}</span>
              {blog?.usersInvolved && blog.usersInvolved.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <AvatarGroup>
                    {blog.usersInvolved.map(user => (
                      <Avatar key={user.name} sx={{bgcolor: 'rgba(219,4,129,0.5)', width: 32, height: 32}}>
                        {user.name.charAt(0)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <span>{blog.usersInvolved.map(u => u.name).join(', ')}</span>
                </Stack>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {blog?.metaImage && (
            <div className="relative h-[16rem] md:h-[24rem] lg:h-[28rem] mb-10 rounded-lg overflow-hidden">
              <ImageWithFallback
                fill
                className="object-cover"
                src={blog.metaImage}
                alt={blog?.title ?? 'blog'}
              />
            </div>
          )}

          {/* Blog Content with Typography Styles */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
              prose-ul:my-4 prose-ul:pl-6 prose-li:mb-2
              prose-ol:my-4 prose-ol:pl-6
              prose-img:rounded-lg prose-img:my-6
              prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{__html: blog?.content ?? ''}}
          />
        </article>
      </Container>
    </div>
  );
};
