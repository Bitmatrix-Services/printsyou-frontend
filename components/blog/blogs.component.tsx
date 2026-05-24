import {Container} from '@components/globals/container.component';
import {Blog} from '@components/blog/type';
import React, {FC} from 'react';
import {BlogCardItem} from '@components/blog/blog-item-card';
import {Breadcrumb} from '@components/globals/breadcrumb.component';

interface IBlogsComponent {
  allBlogs: Blog[];
}

export const BlogsComponent: FC<IBlogsComponent> = ({allBlogs}) => {
  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Blogs" />
      <div className="bg-white py-12">
        <Container>
          {allBlogs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allBlogs
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                .map(blog => (
                  <BlogCardItem key={blog.id} blog={blog} />
                ))}
            </div>
          ) : (
            <div className="flex justify-center w-full items-center my-8">
              <h2 className="my-4 font-bold text-3xl text-primary">No blog found!</h2>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};
