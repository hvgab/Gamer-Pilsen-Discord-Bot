"use strict";
exports = {
    frame(text, frame_char = "#", padding = 1) {
        // Spilt text with \n into array
        let text_array = text.split("\n");
        let longest_line = 0;
        // find longest text linge
        text_array.forEach((line) => {
            if (line.length > longest_line) {
                longest_line = line.length;
            }
        });
        let top_and_bottom = frame_char.repeat(longest_line + padding * 2);
        let empty_line = `${frame_char}${" ".repeat(padding)}${" ".repeat(longest_line)}${" ".repeat(padding)}${frame_char}`;
        for (let index = 0; index < text_array.length; index++) {
            text_array[index] = `${frame_char}${" ".repeat(padding)}${text_array[index]}${" ".repeat(padding)}${frame_char}`;
        }
        text_array.unshift(empty_line);
        text_array.unshift(top_and_bottom);
        text_array.push(empty_line);
        text_array.push(top_and_bottom);
        let return_text = text_array.join("\n");
        return return_text;
    },
};
