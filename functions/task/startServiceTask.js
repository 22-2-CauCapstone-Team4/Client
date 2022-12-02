const startServiceTask = async taskData => {
  // 핸드폰을 깨워만 주는 역할
  // 이거 받으면서, 자연스럽게 index.js쪽 코드 실행될 것, 서비스 자동 시작 가능
  console.log('Boot event js에서 받음');
};

export {startServiceTask};
