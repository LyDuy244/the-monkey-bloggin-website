import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PostMetaStyles = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    margin-left: auto;
    color: inherit;
    .post-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
    .post-title {
      font-weight: bold;
      line-height: 1.5;
      display: block;
      font-size: 22px;
    }

    @media screen and (max-width: 1023.98px) {
      font-size: 10px;
      gap: 6px;
    }
`
const PostMeta = ({ date = "Mar 23", to = "", author = "Andiez Le", className = "" }) => {
  return (
    <PostMetaStyles className={`post-meta ${className}`}>
      <span className="post-time">{date}</span>
      <span className="post-dot"></span>
      <Link to={`/${to}`}>
        <span className="post-author">{author}</span>
      </Link>
    </PostMetaStyles>
  );
};

export default PostMeta;