import webpack from "webpack";

import * as Types from "./types.js";


/**
 * @param {Types.Config} config
 * @returns {webpack.Configuration}
 */
 export default ({ }) => ({
    output: {
        assetModuleFilename: "images/[hash][ext][query]", // extract assets (images and such) to and images folder in the output
    },

    module: {
        rules: [
            {
                // Test for: .png, .jpg, .jpeg, .gif, and .svg
                test: /\.(png|jpe?g|gif|svg)$/i,

                // Webpack 5 has builtin image loading support that auto inlines based off of image size
                type: "asset",
                // type: "asset/resource", // this extracts all images as separate files
                // type: "asset/inline", // this inlines all images

                // parser: {
                //     dataUrlCondition: {
                //         maxSize: 30 * 1024, // Set inline-size to 30kb (30 * 1024 bytes)
                //     }
                // }
            }
        ]
    },
});
