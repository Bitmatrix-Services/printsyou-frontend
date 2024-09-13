import {BlogsComponent} from '@components/blog/blogs.component';
import {getAllBlogs} from '@components/blog/blog-apis';
import {Blog} from '@components/blog/type';

const BlogsPage = async () => {
  const response = await getAllBlogs();

  let allBlogs: Blog[] = [];

  if (response?.payload) allBlogs = response.payload;

  return <BlogsComponent allBlogs={allBlogs} />;
};

export default BlogsPage;
