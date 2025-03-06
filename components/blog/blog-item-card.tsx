import React from 'react';
import {convertDateFormat} from '@utils/utils';
import {Blog} from '@components/blog/type';
import {Card, CardContent} from '@mui/joy';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';

interface IBlogCardItem {
  blog: Blog;
}

export const BlogCardItem: React.FC<IBlogCardItem> = ({blog}) => {
  return (
    <Link href={`/blog/${blog.uniqueId}`}>
      <Card className="flex rounded text-center px-4 border">
        <div className="relative ">
          <ImageWithFallback
            className="object-contain"
            height={120}
            width={370}
            src={blog.metaImage}
            alt={blog.title}
          />
        </div>
        <div className="flex-1">
          <CardContent>
            <h1 className="line-clamp-3 min-h-[4rem] md:min-h-[5rem] font-semibold text-[1.5rem]">{blog.title}</h1>
            <h2 className="line-clamp-3 min-h-[3rem] md:min-h-[4.5rem] my-4 text-[1rem]">{blog.tagline}</h2>
            <h5 className="text-sm text-mute">Last Modified: {convertDateFormat(blog.modifiedAt)}</h5>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
