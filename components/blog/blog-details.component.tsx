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
    <div className="bg-white py-4 tablet:py-6 lg:py-12">
      <Container>
        <Grid>
          <h1 className="font-semibold text-2xl md:text-[2rem] tablet:text-[2rem] lg:text-3xl">{blog?.title}</h1>

          <h2 className="my-4 text-[1rem] md:text-[1.1rem] lg:text-[1.2rem]">{blog.tagline}</h2>
          <h5 className="text-sm text-mute">Last Modified: {convertDateFormat(blog.modifiedAt)}</h5>
          <Stack className="mb-6" direction="row" spacing={1}>
            <AvatarGroup>
              {blog?.usersInvolved?.map(user => (
                <Avatar key={user.name} sx={{bgcolor: 'rgba(219,4,129,0.5)'}}>
                  {user.name.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>

            {blog?.usersInvolved?.map((user, index) => (
              <AvatarGroup key={user.name}>
                <h6 className={'text-center'}>
                  {index > 0 && '|'} {user.name}{' '}
                </h6>
              </AvatarGroup>
            ))}
          </Stack>
          <div className="relative h-[12rem] md:h-[20rem] lg:h-[20rem] xl:h-[32rem]">
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
