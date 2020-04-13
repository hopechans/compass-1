import { RouteProps } from "react-router";
import { buildURL } from "../../navigation";

export const ciRoute: RouteProps = {
  path: "/ci",
};

export const ciURL = buildURL(ciRoute.path);
