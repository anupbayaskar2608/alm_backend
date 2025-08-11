/**
 * Generates a new id with the specified prefix and suffix length for the specified fieldName in the specified modelName.
 * The function retrieves all documents from the modelName collection, extracts the specified fieldName value, 
 * finds the highest numeric value in the extracted ids, and generates a new id by incrementing this value by one.
 * If there are no documents in the modelName collection, the function generates a new id with the number 1 as the suffix value.
 *
 * @param {string} prefix - The prefix to prepend to the generated id.
 * @param {number} suffixLength - The desired length of the numeric suffix in the generated id.
 * @param {object} modelName - The Mongoose model to generate the id for.
 * @param {string} fieldName - The name of the field in the modelName schema to extract the ids from.
 * @returns {string} - The newly generated id.
 * @throws {Error} - If there is a server error while generating the id.
 */
const generatePrefixId = async (prefix, suffixLength, modelName, fieldName) => {
  try {
   
    let ids = [];

    // Retrieve documents from the model and only include the specified fieldName
    const documents = await modelName.find({}, { _id: 0, [fieldName]: true });

    if (documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {

        // Extract the string value of the fieldName from the document
        const str = documents[i][fieldName];

        // Split the string into non-digit and digit groups
        const [words, digits] = str.match(/\D+|\d+/g); 

        // Convert the digits to a number and add it to the array of ids
        ids.push(parseInt(digits));

      }

      // Find the max id value and add 1 to it
      const maxId = Math.max(...ids) + 1;
      
      // Concatenate the prefix with the max id and pad it with zeros to match the specified suffixLength
      return prefix + maxId.toString().padStart(suffixLength, '0');

    } else {
      // If there are no documents, return the prefix with the number 1 padded with zeros to match the specified suffixLength
      return prefix + '1'.toString().padStart(suffixLength, '0');
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Server Error while setting ${fieldName} Id`);
  }
};

export default generatePrefixId;
