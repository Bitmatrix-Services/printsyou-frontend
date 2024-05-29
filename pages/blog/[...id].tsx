import Container from '@components/globals/Container';
import Typography from '@mui/material/Typography';
import React, {FC} from 'react';
import CardContent from '@mui/material/CardContent';
import {http} from '../../services/axios.service';
import {Blog} from '@utils/type';
import {GetServerSidePropsContext} from 'next';
import {Avatar, AvatarGroup, Grid, Stack} from '@mui/material';
import {deepPurple} from '@mui/material/colors';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {convertDateFormat} from '@utils/utils';
import ImageWithFallback from '@components/ImageWithFallback';

interface BlogDetailPage {
  blog: Blog;
}

const BlogDetailPage: FC<BlogDetailPage> = ({blog}) => {
  console.log('blog', blog);

  return (
    <div className="bg-white py-12">
      <NextSeo title={`Blog | ${blog?.title} | ${metaConstants.SITE_NAME}`} />
      <Container>
        <Grid className="px-3">
          <Typography className="mb-10" variant="h5">
            {blog?.title}
          </Typography>
          <Typography className="mb-6" variant="body1">
            {convertDateFormat(blog?.modifiedAt)}
          </Typography>
          <Stack className="mb-6" direction="row" spacing={1}>
            <AvatarGroup max={3}>
              {blog?.usersInvolved?.map(user => (
                <Avatar key={user.name} sx={{bgcolor: deepPurple[500]}}>
                  {user.name.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>

            {blog?.usersInvolved?.map((user, index) => (
              <AvatarGroup max={3} key={user.name}>
                <Typography classes={'item-center'}>
                  {index > 0 && '|'} {user.name}{' '}
                </Typography>
              </AvatarGroup>
            ))}
          </Stack>
          <div className="relative h-[32rem]">
            <ImageWithFallback
              fill
              className="object-contain object-left"
              src={blog?.metaImage ?? ''}
              alt={blog?.title ?? 'blog'}
            />
          </div>
        </Grid>
        <CardContent>
          <div dangerouslySetInnerHTML={{__html: blog?.content ?? ''}}></div>
        </CardContent>
      </Container>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id;
  try {
    const {data} = await http.get(`/blog/unique/${id}`);
    const blog = data.payload;
    return {props: {blog}};
  } catch (error) {
    return {props: {blog: {}}};
  }
};

export default BlogDetailPage;
