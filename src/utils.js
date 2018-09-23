import moment from "moment";

export const getEditDistance = (a, b) => {
  /**
   * Generic edit distance algorithm
   * Taken from https://gist.github.com/andrei-m/982927
   */

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

export const serializeObjectValues = (obj, schema) => {
  /**
   * Searilaizes object values using object schema
   */
  return Object.keys(schema).reduce((acc, key) => {
    if (obj[key]) {
      return acc.concat(obj[key]);
    }
    return acc;
  }, "");
};

export const emptyFixture = {
  /**
   * empty fixture object used as schema.
   */
  team1: "",
  team2: "",
  sport: "",
  championship: "",
  start_time: 0
};

export const mapAndNormalizeFixtures = (primaryArr, secondaryArr) => {
  /**
   * normalizes fixtures array of objects
   * finds the secondary fixture using the edit distance by passing serializeObjectValues
   * secondary fixture that has minimum edit distance with the primary becomes the secondary fixture
   */
  let entitiesObject = {};
  let result = [];
  primaryArr.forEach((primaryFixObj, index) => {
    let minDistance;

    const primarySerialized = serializeObjectValues(
      primaryFixObj,
      emptyFixture
    );

    secondaryArr.forEach(secondaryFixObj => {
      const secondarySerialized = serializeObjectValues(
        secondaryFixObj,
        emptyFixture
      );

      const editDistance = getEditDistance(
        primarySerialized,
        secondarySerialized
      );

      if (minDistance === undefined || editDistance < minDistance) {
        minDistance = editDistance;
        primaryFixObj["secondary"] = secondaryFixObj;
        primaryFixObj["editDistance"] = editDistance;
      }
    });

    primaryFixObj["id"] = `primary-${index}`;
    result.push(primaryFixObj.id);
    entitiesObject = {
      ...entitiesObject,
      [primaryFixObj["id"]]: primaryFixObj
    };
  });

  return {
    entitiesObject,
    result
  };
};

export const sortByDate = (result, entities, key, asc) => {
  /**
   * sorts result array by date
   */
  return result.sort((id1, id2) => {
    const t1 = entities[id1][key];
    const t2 = entities[id2][key];
    if (moment(t1).isBefore(t2)) {
      return asc ? -1 : 1;
    }
    return asc ? 1 : -1;
  });
};
