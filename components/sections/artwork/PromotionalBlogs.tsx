import React, {FC, Fragment} from 'react';
import Container from '@components/globals/Container';
import {Blog} from '@utils/type';
import sanitize from 'sanitize-html';

interface ArtworkProps {
  allBlogs: Blog[];
}

const PromotionalBlogs: FC<ArtworkProps> = ({allBlogs}) => {
  return (
    <div className="bg-white pt-12">
      <Container>
        <div className="pt-2 pb-8 mb-10 ml-4">
          {allBlogs?.length > 0 ? (
            allBlogs
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(blog => (
                <Fragment key={blog.id}>
                  <div className="text-2xl mb-5 font-bold">{blog.title}</div>
                  <p
                    dangerouslySetInnerHTML={{__html: sanitize(blog.content)}}
                    className="font-medium text-mute3 mb-5 text-[16px] leading-[30px] font-poppins"
                  ></p>
                </Fragment>
              ))
          ) : (
            <div className="m-16 flex items-center justify-center">
              <h4>No Blogs Found</h4>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PromotionalBlogs;
