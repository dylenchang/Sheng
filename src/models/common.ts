export type CommonResponse = {
  result: "success" | "fail";
};

export type LoginResponse = {
  status: number;
  msg: string;
  data: {
    token: string;
  };
};
