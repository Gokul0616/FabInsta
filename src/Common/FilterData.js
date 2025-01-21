export const extractDisplayOrderData = (array) => {
  const result = [];

  function traverse(node) {
    if (node) {
      // Add the current node's relevant properties to the result only if it has a group
      if (node.group) {
        result.push({
          name: node.name,
          group: node.group,
          displayOrder: node.displayOrder || null,
          groupDisplayOrder: node.groupDisplayOrder || null,
        });
      }

      // Recursively traverse children if they exist
      if (Array.isArray(node.child)) {
        node.child.forEach(traverse);
      }
    }
  }

  // Process each object in the array
  array.forEach((obj) => traverse(obj));

  return result;
};

export const processGroupedContent = (data) => {
  const grouped = data.reduce((acc, item) => {
    const { group, groupDisplayOrder, displayOrder, name } = item;

    // Ensure the group exists
    if (!acc[group]) {
      acc[group] = {
        items: [],
        groupDisplayOrder,
      };
    }

    // Add item to the group
    acc[group].items.push({ name, displayOrder });

    return acc;
  }, {});

  // Sort groups and items within groups
  return Object.entries(grouped)
    .sort((a, b) => a[1].groupDisplayOrder - b[1].groupDisplayOrder)
    .map(([key, value]) => ({
      groupName: key,
      items: value.items.sort((a, b) => a.displayOrder - b.displayOrder),
    }));
};

const renderSectionItems = (section, subSection) => {
  const content = fabricContent[section][subSection];
  if (content && typeof content === "object") {
    return Object.keys(content).map((key) => {
      const item = content[key];
      return (
        <TouchableOpacity
          key={key}
          style={styles.checkboxRow}
          onPress={() => handleCheckboxChange(item, "fabric_content")}
        >
          <Checkbox
            color={common.PRIMARY_COLOR}
            status={
              selectedFabricContents.includes(findKeyForFabricContent(item))
                ? "checked"
                : "unchecked"
            }
          />
          <Text style={[styles.categoryText, { fontFamily: font.regular }]}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    });
  }
  return null; // Return null if the section or subsection doesn't exist
};

export const findObjectByName = (arr, name) => {
  // Recursive function to search for the object by name
  function search(array, targetName) {
    for (let item of array) {
      if (item.name === targetName) {
        return item;
      }
      if (item.child && item.child.length > 0) {
        let result = search(item.child, targetName);
        if (result) return result;
      }
    }
    return null;
  }

  // Handle case when a child name is provided
  let result = search(arr, name);
  if (result && result.child.length > 0) {
    return result;
  }
  return null;
};

export const getChildren = (obj) => {
  return obj.child || [];
};

export const formateData = (data) => {
  const result = {};

  data.forEach((item) => {
    for (const key in item) {
      const category = item[key];
      const categoryName = key;
      const categoryId = category.categoryId;

      if (!result[categoryName]) {
        result[categoryName] = [];
      }

      if (categoryId) {
        result[categoryName].push(categoryId);
      } else {
        result[categoryName].push(...category);
      }
    }
  });

  return result;
};
