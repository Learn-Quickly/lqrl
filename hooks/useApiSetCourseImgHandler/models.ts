export type ApiSetCourseImgHandlerPathParams = {
  /**
   * @description ID of the course for which we set an avatar
   * @type integer, int64
   */
  course_id: number;
};

/**
 * @description Course image successfully set
 */
export type ApiSetCourseImgHandler200 = any;

export type ApiSetCourseImgHandlerMutationRequest = FormData;

export type ApiSetCourseImgHandlerMutationResponse = any;

export type ApiSetCourseImgHandlerMutation = {
  Response: ApiSetCourseImgHandlerMutationResponse;
  Request: ApiSetCourseImgHandlerMutationRequest;
  PathParams: ApiSetCourseImgHandlerPathParams;
};
