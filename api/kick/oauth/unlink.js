/* OBFUSCATED_TAKU_20260501 */
(()=>{
  const __codeBase64 = "Y29uc3QgeyBjcmVhdGVSZWRpc0NsaWVudCB9ID0gcmVxdWlyZSgiLi4vLi4vX2xpYi9yZWRpcy5qcyIpOwpjb25zdCB7IHNlbmRKc29uLCBzZW5kT3B0aW9ucyB9ID0gcmVxdWlyZSgiLi4vLi4vX2xpYi9odHRwLmpzIik7CmNvbnN0IHsgZGVsZXRlS2lja0xpbmsgfSA9IHJlcXVpcmUoIi4uLy4uL19saWIva2ljay1vYXV0aC5qcyIpOwoKbW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7CiAgY29uc3QgbWV0aG9kID0gU3RyaW5nKHJlcS5tZXRob2QgfHwgIlBPU1QiKS50b1VwcGVyQ2FzZSgpOwogIGlmIChtZXRob2QgPT09ICJPUFRJT05TIikgewogICAgc2VuZE9wdGlvbnMocmVzLCAiUE9TVCwgREVMRVRFLCBPUFRJT05TIik7CiAgICByZXR1cm47CiAgfQogIGlmIChtZXRob2QgIT09ICJQT1NUIiAmJiBtZXRob2QgIT09ICJERUxFVEUiKSB7CiAgICByZXMuc2V0SGVhZGVyKCJBbGxvdyIsICJQT1NULCBERUxFVEUsIE9QVElPTlMiKTsKICAgIHNlbmRKc29uKHJlcywgeyBvazogZmFsc2UsIGVycm9yOiAiTUVUSE9EX05PVF9BTExPV0VEIiB9LCA0MDUpOwogICAgcmV0dXJuOwogIH0KCiAgY29uc3QgcmVkaXMgPSBjcmVhdGVSZWRpc0NsaWVudCgpOwogIGlmICghcmVkaXMpIHsKICAgIHNlbmRKc29uKAogICAgICByZXMsCiAgICAgIHsKICAgICAgICBvazogZmFsc2UsCiAgICAgICAgZXJyb3I6ICJNSVNTSU5HX0tWX1JFU1RfRU5WIiwKICAgICAgICByZXF1aXJlZEVudjogWyJLVl9SRVNUX0FQSV9VUkwiLCAiS1ZfUkVTVF9BUElfVE9LRU4iXQogICAgICB9LAogICAgICA1MDAKICAgICk7CiAgICByZXR1cm47CiAgfQoKICB0cnkgewogICAgYXdhaXQgZGVsZXRlS2lja0xpbmsocmVkaXMpOwogICAgc2VuZEpzb24ocmVzLCB7IG9rOiB0cnVlLCBsaW5rZWQ6IGZhbHNlIH0sIDIwMCk7CiAgfSBjYXRjaCAoZXJyb3IpIHsKICAgIHNlbmRKc29uKAogICAgICByZXMsCiAgICAgIHsKICAgICAgICBvazogZmFsc2UsCiAgICAgICAgZXJyb3I6IGBLSUNLX09BVVRIX1VOTElOS19GQUlMRUQ6JHtTdHJpbmcoZXJyb3I/Lm1lc3NhZ2UgfHwgInJlcXVlc3RfZmFpbGVkIil9YAogICAgICB9LAogICAgICA1MDAKICAgICk7CiAgfQp9Owo=";

  const __decodeBase64Utf8 = (base64Value) => {
    if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
      return Buffer.from(base64Value, "base64").toString("utf8");
    }

    const binary = atob(base64Value);
    let percentEncoded = "";
    for (let index = 0; index < binary.length; index += 1) {
      const hex = binary.charCodeAt(index).toString(16).padStart(2, "0");
      percentEncoded += `%${hex}`;
    }
    return decodeURIComponent(percentEncoded);
  };

  const __decodedCode = __decodeBase64Utf8(__codeBase64);
  eval(__decodedCode);
})();
