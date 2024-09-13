import {Container} from '@components/globals/container.component';
import {Blog} from '@components/blog/type';
import {FC} from 'react';
import {BlogCardItem} from '@components/blog/blog-item-card';

interface IBlogsComponent {
  allBlogs: Blog[];
}
export const BlogsComponent: FC<IBlogsComponent> = ({allBlogs}) => {
  return (
    <div className="bg-white pt-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {allBlogs?.length > 0 ? (
            allBlogs
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(blog => <BlogCardItem key={blog.id} blog={blog} />)
          ) : (
            <div className="m-16 flex items-center justify-center">
              <h4 className="text-2xl font-semibold">No Blogs Found</h4>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
