import React from 'react';
import { Link } from 'react-router-dom';
import Img404 from './images/404.png';

export default function NotFound() {
  return (
    <div className="page-not-found">
      <div className="page-not-found-content">
        <img
          src={Img404}
          className="page-not-found-content-image"
          alt="页面不存在"
        />
        <div>
          <h3 className="page-not-found-content-title">
            抱歉，你访问的页面不存在
          </h3>
          <p className="page-not-found-content-description">
            您要找的页面没有找到，请返回&nbsp;
            <Link to="/">首页</Link>
            &nbsp;继续浏览
          </p>
        </div>
      </div>
    </div>
  );
}
