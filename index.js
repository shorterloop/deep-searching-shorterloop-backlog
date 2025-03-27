function deepSearching(filters, data, replacements) {
  if (!filters || !data || !replacements) {
    throw new Error(
      'Invalid input: Filters, data, or replacements are missing.'
    );
  }
  const removeEmptyStringValues = obj => {
    const newObj = {};
    for (const key in obj) {
      if (obj[key] !== '') {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  };

  let {
    status,
    owner,
    workItem,
    searchingKeyword = '',
    unScored,
    epicId,
    teamId,
    solutionId,
    versionId,
    projectTypeKey
  } = removeEmptyStringValues(filters);
  searchingKeyword = searchingKeyword.toLocaleLowerCase();
  const {
    workItem: workItemReplacement,
    owner: ownerReplacement,
    status: statusReplacement,
  } = replacements;
  // Validate the format of owner array
  if (
    owner &&
    (!Array.isArray(owner) || owner.some(id => typeof id !== 'number'))
  ) {
    throw new Error('Invalid owner format: Should be an array of numbers.');
  }

  // Validate workItemReplacement
  if (!['externalKey', 'owner', 'status'].includes(workItemReplacement)) {
    throw new Error('Invalid workItemReplacement value.');
  }

  function removeDuplicatesById(arr) {
    const uniqueIds = {};
    return arr.filter(obj => {
      const id = `${obj.id}_${obj?.externalKey?.replace('-', '_')}`;
      if (!uniqueIds[id]) {
        uniqueIds[id] = true;
        return true;
      }
      return false;
    });
  }

  function recursiveFilterByWorkItem(items) {
    const result = [];
    for (const item of items) {
      if (item?.externalKey?.startsWith(workItem)) {
        result.push(item);
      }

      if (
        (item.userStories && !item.userStories?.length) ||
        !item.userStories
      ) {
        item.userStories = item.features;
      }
      if (item.features?.length) {
        const matchedFeatures = recursiveFilterByWorkItem(item.features);
        if (matchedFeatures.length) {
          result.push(...matchedFeatures);
        }
      }

      if (item.userStories?.length) {
        const matchedUserStories = recursiveFilterByWorkItem(item.userStories);
        if (matchedUserStories.length) {
          result.push(...matchedUserStories);
        }
      }
    }
    return removeDuplicatesById(result);
  }

  function recursiveFilterByStatus(items) {
    const result = [];
    let itemIds = [];
    for (const item of items) {
      itemIds.push(`${item.id}_${item?.externalKey?.replace('-', '_')}`);
      if (item[statusReplacement] === status) {
        if (item.features && item.features.length) {
          const featureIds = item.features.map(
            feature => `${feature.id}_${feature?.externalKey?.replace('-', '_')}`
          );
          itemIds = itemIds.concat(...featureIds);
        }
        if (item.userStories && item.userStories.length) {
          const userStoryIds = item.userStories.map(
            feature => `${feature.id}_${feature?.externalKey?.replace('-', '_')}`
          );

          itemIds = itemIds.concat(...userStoryIds);
        }
        result.push(item);
      }

      if (item.features?.length) {
        const matchedFeatures = recursiveFilterByStatus(item.features);

        matchedFeatures.forEach(feature => {
          if (
            itemIds.indexOf(
              `${feature.id}_${feature.externalKey.replace('-', '_')}`
            ) === -1
          ) {
            result.push(feature);
          }
        });
      }
      if (item.userStories?.length) {
        const matchedUserStories = recursiveFilterByStatus(item.userStories);
        matchedUserStories.forEach(feature => {
          if (
            itemIds.indexOf(
              `${feature.id}_${feature.externalKey.replace('-', '_')}`
            ) === -1
          ) {
            result.push(feature);
          }
        });
      }
    }

    return removeDuplicatesById(result);
  }
  // Function to check, parse, and join tags
  function parseAndJoinTags(item) {
    if (item.tags && typeof item.tags === 'string') {
      try {
        // Attempt to parse the string
        let parsedTags = JSON.parse(item.tags);

        // Check if parsedTags is an array
        if (Array.isArray(parsedTags)) {
          // Join the array elements by a space
          return parsedTags.map(tag => '#' + tag).join(" ");
        } else {
          return '';
        }
      } catch (e) {
        return '';
      }
    } else {
      return '';
    }
  }

  function removeHtmlTagsAndEntities(myString) {
    return myString.replace(/<[^>]*>?/gm, '').replace(/&[^;\s]+;/g, '')?.trim();
  }

  function recursiveFilterBySearchKey(items) {
    const result = [];
    for (const item of items) {
      const text = `${item?.externalKey || ''} ${item?.summary || ''} ${item?.description || ''} ${parseAndJoinTags(item)}`;
      const isMatched = removeHtmlTagsAndEntities(text)
        .toLocaleLowerCase()
        .includes(searchingKeyword);
      if (isMatched) {
        result.push(item);
      }

      if (item.features?.length) {
        const matchedFeatures = recursiveFilterBySearchKey(item.features);
        result.push(...matchedFeatures);
      }
      if (item.userStories?.length) {
        const matchedUserStories = recursiveFilterBySearchKey(item.userStories);
        result.push(...matchedUserStories);
      }
    }

    return removeDuplicatesById(result);
  }
  function recursiveFilterByOwners(items) {
    const result = [];
    for (const item of items) {
      const parsedUserId = parseStringifiedArray(item.userId);
      let isMatched = false;
      if (Array.isArray(parsedUserId)) {
        // Handle array case
        isMatched = parsedUserId.some(id => owner.includes(parseInt(id, 10)));
      } else {
        // Handle non-array case
        isMatched = owner.includes(parseInt(parsedUserId, 10));
      }

      if (isMatched) {
        result.push(item);
      }

      if (item.features?.length) {
        const matchedFeatures = recursiveFilterByOwners(item.features);
        result.push(...matchedFeatures);
      }
      if (item.userStories?.length) {
        const matchedUserStories = recursiveFilterByOwners(item.userStories);
        result.push(...matchedUserStories);
      }
    }

    return removeDuplicatesById(result);
  }

  function recursiveFilterByScore(unScored, items) {
    if (unScored) {
      items = items.filter(item => (!item?.score || item?.score == 0));
    }

    if (!unScored) {
      items = items.filter(item => (item?.score > 0));
    }
    return items;
  }

  function recursiveFilterByEpicId(epicId, items) {
    items = items.filter(item => (item?.epicId == epicId));
    return items;
  }

  function recursiveFilterByTeamId(teamId, items) {
    items = items.filter(item => (item?.teamId == teamId));
    return items;
  }

  function recursiveFilterBysolutionId(solutionId, items) {
    items = items.filter(item => (item?.solutionId == solutionId));
    return items;
  }

  function recursiveFilterByVersionId(versionId, items) {
    return items.filter(item =>
      item?.version?.some(element => element.id === versionId)
    );
  }

  function recursiveFilterByjiraProjectId(projectTypeKey, items) {
    return items.filter(item => item.jiraKey.startsWith(projectTypeKey));
  }
  
  const isStringifiedArray = value => {
    return (
      typeof value === 'string' && value.startsWith('[') && value.endsWith(']')
    );
  };

  // Function to parse stringified arrays
  const parseStringifiedArray = value => {
    return isStringifiedArray(value) ? JSON.parse(value) : value;
  };

  // Perform search based on workItem replacement and return the result
  // if (workItemReplacement === 'externalKey' && workItem) {
  let filteredByWorkItem = data;
  if (workItem) {
    filteredByWorkItem = recursiveFilterByWorkItem(filteredByWorkItem);
  }

  if (status) {
    filteredByWorkItem = recursiveFilterByStatus(filteredByWorkItem);
  }
  if (owner && owner.length) {
    filteredByWorkItem = recursiveFilterByOwners(filteredByWorkItem);
  }

  if (searchingKeyword) {
    filteredByWorkItem = recursiveFilterBySearchKey(filteredByWorkItem);
  }

  if (typeof unScored !== 'undefined') {
    filteredByWorkItem = recursiveFilterByScore(unScored, filteredByWorkItem);
  }

  if (epicId) {
    filteredByWorkItem = recursiveFilterByEpicId(epicId, filteredByWorkItem);
  }

  if (teamId) {
    filteredByWorkItem = recursiveFilterByTeamId(teamId, filteredByWorkItem);
  }

  if (solutionId) {
    filteredByWorkItem = recursiveFilterBysolutionId(solutionId, filteredByWorkItem);
  }

  if (versionId) {
    filteredByWorkItem = recursiveFilterByVersionId(versionId, filteredByWorkItem);
  }

  if (projectTypeKey) {
    filteredByWorkItem = recursiveFilterByjiraProjectId(projectTypeKey, filteredByWorkItem);
  }

  if (workItem) {
    let workItems = [];
    filteredByWorkItem.forEach(item => {
      if (item.externalKey.startsWith(workItem)) {
        workItems.push(item);
      }
    });

    filteredByWorkItem = workItems;
  }
  return filteredByWorkItem;
}

module.exports = deepSearching; // If using CommonJS modules
