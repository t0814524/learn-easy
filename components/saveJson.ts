const saveJsonToFile = async (data) => {
    const path = `${RNFS.DocumentDirectoryPath}/mydata.json`;

    try {
        const jsonString = JSON.stringify(data);
        await RNFS.writeFile(path, jsonString, 'utf8');
        console.log('File written successfully to:', path);
    } catch (error) {
        console.error('Failed to write file:', error);
    }
};

const readJsonFromFile = async () => {
    const path = `${RNFS.DocumentDirectoryPath}/mydata.json`;

    try {
        const jsonString = await RNFS.readFile(path, 'utf8');
        const data = JSON.parse(jsonString);
        console.log('File read successfully:', data);
        return data;
    } catch (error) {
        console.error('Failed to read file:', error);
        return null;
    }
};
