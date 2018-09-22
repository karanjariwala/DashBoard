// Compute the edit distance between the two given strings
const getEditDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
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

const serializeObjectValues = (obj, schema) => {
  return Object.keys(schema).reduce((acc, key) => {
    if (obj[key]) {
      return acc.concat(obj[key]);
    }
    return acc;
  }, "");
};

const emptyFixture = {
  team1: "",
  team2: "",
  sport: "",
  championship: "",
  start_time: 0
};

const cleanAndMapFixtures = (primaryArr, secondaryArr) => {
  return primaryArr.map(primaryFixObj => {
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

    return primaryFixObj;
  });
};

export default cleanAndMapFixtures;
