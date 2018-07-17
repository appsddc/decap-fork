import { flow } from "lodash";
import unsentRequest from "netlify-cms-lib-util/unsentRequest";
import { then } from "netlify-cms-lib-util/promise";
import GitlabAPI from "Backends/gitlab/API";

export default class API extends GitlabAPI {
  constructor(config) {
    super(config);
    this.tokenPromise = config.tokenPromise;
    this.commitAuthor = config.commitAuthor;
    this.repoURL = "";
  }

  authenticateRequest = async req => unsentRequest.withHeaders({
    Authorization: `Bearer ${ await this.tokenPromise() }`,
  }, req);

  request = async req => flow([
    this.buildRequest,
    this.authenticateRequest,
    then(unsentRequest.performRequest),
  ])(req);

  hasWriteAccess = () => Promise.resolve(true)
}