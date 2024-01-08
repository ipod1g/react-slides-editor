import React from 'react';
import useDetectMobile from '../../lib/useDetectMobile';

const MobileLock = () => {
  const { isMobile } = useDetectMobile();

  return isMobile ? (
    <div className="fixed z-[9999] inset-0 bg-white flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          This is currently available only on desktop view
        </h1>
        <p className="text-lg">Please open this link on your desktop instead</p>
      </div>
    </div>
  ) : null;
};

export default MobileLock;
