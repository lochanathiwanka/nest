import { isString, isObject } from '@nestjs/common/utils/shared.utils';
import * as Interfaces from '../interfaces';

export class MsvcUtil {

  /**
   * Transforms the Pattern to Route.
   * 1. If Pattern is a `string`, it will be returned as it is.
   * 2. If Pattern is a `number`, it will be converted to `string`.
   * 3. If Pattern is a `JSON` object, it will be transformed to Route. For that end,
   * the function will sort properties of `JSON` Object and creates `route` string
   * according to the following template:
   * <key1>:<value1>/<key2>:<value2>/.../<keyN>:<valueN>
   *
   * @param  {Interfaces.MsPattern} pattern - client pattern
   * @returns string
   */
  public static transformPatternToRoute(pattern: Interfaces.MsPattern): string {
    // Returns the pattern according to the 1st and the 2nd points
    if (isString(pattern) || typeof pattern === 'number') {
      return `${pattern}`;
    }

    // Throws the error if the pattern has an incorrect type
    if (!isObject(pattern)) {
      throw new Error(`The pattern must be of type 'string' or 'object'!`);
    }

    // Gets keys of the JSON Pattern and sorts them
    const sortedKeys = Object.keys(pattern)
      .sort((a, b) => ('' + a).localeCompare(b));

    // Creates the array of Pattern params from sorted keys and their corresponding values
    const sortedPatternParams = sortedKeys.map((key) =>
      `${key}:${MsvcUtil.transformPatternToRoute(pattern[key])}`);

    // Creates and returns the Route
    const route = sortedPatternParams.join('/');
    return `{${route}}`;
  }
}
