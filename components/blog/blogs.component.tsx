import {Container} from '@components/globals/container.component';
import {Blog} from '@components/blog/type';
import React, {FC} from 'react';
import {BlogCardItem} from '@components/blog/blog-item-card';
import {v4 as uuidv4} from 'uuid';

interface IBlogsComponent {
  allBlogs: Blog[];
}

export const BlogsComponent: FC<IBlogsComponent> = ({allBlogs}) => {
  return (
    <div className="bg-white pt-12">
      <Container>
        {allBlogs?.length > 0 ? (
          allBlogs
            .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
            .map(blog => (
              <div key={uuidv4()} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <BlogCardItem blog={blog} />
              </div>
            ))
        ) : (
          <div className="flex justify-center w-full items-center my-8">
            <h2 className="my-4 font-bold text-3xl text-primary">No blog found!</h2>
          </div>
        )}
      </Container>
    </div>
  );
};
