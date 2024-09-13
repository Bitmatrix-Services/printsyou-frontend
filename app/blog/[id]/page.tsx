import {BlogDetailsComponent} from '@components/blog/blog-details.component';
import {getBlogDetails} from '@components/blog/blog-apis';
import {Blog} from '@components/blog/type';

const BlogDetailsPage = async ({params}: {params: {id: string}}) => {
  const response = await getBlogDetails(params.id);

  let blog: Blog | null = null;

  if (response?.payload) blog = response.payload;

  return <BlogDetailsComponent blog={blog} />;
};

export default BlogDetailsPage;
