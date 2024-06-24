function compressObject(obj) {
    // Serialize the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // Compress the JSON string using LZ-string
    const compressed = LZString.compressToEncodedURIComponent(jsonString);

    return compressed;
}

function decompressObject(compressed) {
    // Decompress the string back to JSON
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);

    // Parse the JSON string back to an object
    return JSON.parse(decompressed);
}
