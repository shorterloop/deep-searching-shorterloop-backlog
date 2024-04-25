// function (keyword,artifacts)
// flatten artifacts
// filter flattened data
// revert to array
let artifactResult = [];
function transformArray(keyword, data) {
  const transformed = [];
  data.forEach(obj => {
    // If keyword is FE-, extract features and flatten
    if (obj.externalKey && obj.externalKey.startsWith(keyword)) {
      transformed.push(obj);
    }

    if (obj.features) {
      if (
        keyword === 'FE-' &&
        obj.externalKey &&
        obj.externalKey.startsWith('EP-')
      ) {
        const innerFeatures = obj.features
          .filter(
            feature =>
              feature.externalKey && feature.externalKey.startsWith('FE-')
          )
          .map(obj => {
            obj.features = obj.userStories;
            // delete obj.userStories;
            return obj;
          });

        transformed.push(...innerFeatures);
      }

      if (keyword === 'US-') {
        let innerUserStories = obj.features.filter(
          feature =>
            feature.externalKey && feature.externalKey.startsWith('US-')
        );
        if (!innerUserStories.length) {
          innerUserStories = obj.features
            .filter(
              feature =>
                feature.userStories &&
                feature.userStories.some(
                  story =>
                    story.externalKey && story.externalKey.startsWith('US-')
                )
            )
            .map(us => us.userStories)
            .flat();
        }

        transformed.push(...innerUserStories);
      }
    }
  });

  return transformed;
}

/**
 * It performs searching on input artifacts
 * @param {string} keyword - search string
 * @param {array} artifacts - nested array or object
 * @param {*} options[optional] - exclude(array of keys that needs to be excluded while searching)
 */
function deepSearch(
  keyword,
  artifacts,
  options = { exclude: [], searchByKey: '' }
) {
  if (['FE-', 'EP-', 'US-'].indexOf(keyword) === -1) {
    artifacts = artifactResult.length ? artifactResult : artifacts;
  }
  let filteredArtifacts = artifacts.filter(artifact => {
    return deepSearchHelper(keyword, artifact, options);
  });
  if (['FE-', 'EP-', 'US-'].indexOf(keyword) > -1) {
    filteredArtifacts = transformArray(keyword, filteredArtifacts);
  }

  artifactResult = clean(filteredArtifacts);
  return artifactResult;
}

function deepSearchHelper(keyword, artifact, options) {
  if (typeof artifact !== 'object') {
    return artifact
      .toString()
      .toLowerCase()
      .includes(keyword.toLowerCase());
  }

  if (Array.isArray(keyword)) {
    const isPresent = options.searchByKey
      ? keyword.some(
        kw =>
          artifact[options.searchByKey] &&
          artifact[options.searchByKey].includes(kw)
      )
      : 0;
    const features = artifact.features;

    if (features?.length) {
      artifact.features = features.filter(feature =>
        keyword.some(kw =>
          (typeof feature[options.searchByKey] === 'string'
            ? JSON.parse(feature[options.searchByKey])
            : feature[options.searchByKey]
          ).includes(kw)
        )
      );

      if (artifact.features.length) {
        return true;
      }
    }
    const userStories = artifact.userStories;
    if (userStories?.length) {
      artifact.userStories = userStories.filter(feature =>
        keyword.some(kw =>
          (typeof feature[options.searchByKey] === 'string'
            ? JSON.parse(feature[options.searchByKey])
            : feature[options.searchByKey]
          ).includes(kw)
        )
      );
      if (artifact.userStories.length) {
        return true;
      }
    }

    if (isPresent) {
      return true;
    }
  } else {
    for (let key in artifact) {
      if (deepSearchHelper(keyword, artifact[key], options)) {
        return true;
      }
    }
  }

  return false;
}

function clean(object) {
  Object.entries(object)
    .slice()
    .reverse()
    .forEach(([k, v]) => {
      if (v && typeof v === 'object') {
        if (Array.isArray(v)) {
          object[k] = v.filter(function (el) {
            return el != null;
          });
        }
        v = object[k];
        clean(v);
      }
      if (
        (v && typeof v === 'object' && !Object.keys(v).length) ||
        v === null ||
        v === undefined ||
        !v
      ) {
        if (Array.isArray(object)) {
          object.splice(k--, 1);
        } else {
          delete object[k];
        }
      }
    });
  return object;
}

module.exports = {
  deepSearch,
};
