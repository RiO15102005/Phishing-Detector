import React from 'react';
import ChatPage from '../pages/ChatPage';

// Tạm thời hiển thị trực tiếp ChatPage. 
// Nếu bạn sử dụng react-router-dom, bạn có thể bọc <Routes> ở đây sau.
const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ChatPage />
    </React.Suspense>
  );
};

export default AppRoutes;