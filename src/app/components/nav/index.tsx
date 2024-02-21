"use client";

import React, { useState } from "react";

const Navbar = () => {
  const [showContent, setShowContent] = useState(false);

  const handleItemClick = (index: number) => {
    if (index === 1) {
      // 第二个 <li> 的索引为 1
      setShowContent(!showContent);
    }
  };

  return (
    <nav>
      <ul className="flex">
        <li className="mx-5 py-5" onClick={() => handleItemClick(0)}>
          个人及家庭产品
        </li>
        <li className="mx-5 py-5" onClick={() => handleItemClick(1)}>
          商用产品及方案
        </li>
        <li className="mx-5 py-5" onClick={() => handleItemClick(2)}>
          服务支持
        </li>
        <li className="mx-5 py-5" onClick={() => handleItemClick(3)}>
          企业业务支持
        </li>
        <li className="mx-5 py-5" onClick={() => handleItemClick(4)}>
          运营商网络支持
        </li>
      </ul>

      {showContent && (
        <div className="flex flex-col items-center fixed top-16 left-0 right-0 bg-white p-4 h-40">
          <div className="flex justify-center">
            <div className="mx-6">
              <div className="font-bold">产品</div>
              <div>
                <div>联接</div>
                <div>运营商网络</div>
                <div>企业网络</div>
                <div>企业光网络</div>
                <div>企业无线</div>
              </div>
              <div>计算</div>
              <div>云</div>
            </div>
            <div className="mx-6 font-bold">
              <div>服务</div>
              <div>运营商服务</div>
              <div>政企服务</div>
              <div>上云服务</div>
            </div>
            <div className="mx-6">
              <div>行业解决方案</div>
              <div>电信</div>
              <div>金融</div>
              <div>电力</div>
              <div>油气</div>
              <div>制造</div>
              <div>教育</div>
              <div>更多行业方案</div>
            </div>
            <div className="mx-6">热点话题</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
