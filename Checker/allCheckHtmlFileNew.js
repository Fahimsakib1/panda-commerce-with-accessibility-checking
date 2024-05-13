const fs = require('fs');
const cheerio = require('cheerio');






function findEmptyButtonsAndEmptyAnchorLink(htmlContent) {

    const $ = cheerio.load(htmlContent);

    const buttonTags = $('button');
    const anchorTags = $('a');


    let buttonCount = 0;
    let emptyButtons = [];
    let meaningLessTextInButtons = [];
    let issueFreeButtons = []



    let anchorCount = 0;
    let emptyAnchors = [];
    let meaningLessTextInAnchors = [];
    let emptyHrefInAnchors = [];
    let invalidHrefAnchors = [];
    let issueFreeAnchors = [];
    let anchorNotContainImageProperly = [];








    const altRegexButton = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    const altRegexAnchor = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;



    // Code for checking the buttons and anchor tags that are empty. Means no text in the button and anchor tags
    buttonTags.each(function () {
        buttonCount++;
        const buttonText = $(this).text().trim();
        if (!buttonText) {
            emptyButtons.push($(this).toString());
            return;
        }
        if (altRegexButton.test(buttonText.trim())) {
            meaningLessTextInButtons.push($(this).toString());
            return;
        }
        issueFreeButtons.push($(this).toString());
    });





















    //Ekdom shuru te ei function chilo
    // anchorTags.each(function () {
    //     anchorCount++;
    //     const $anchor = $(this);
    //     const anchorText = $anchor.text().trim();
    //     const hrefAttribute = $anchor.attr('href');
    //     const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    //     if (!anchorText) {
    //         emptyAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if (altRegexAnchor.test(anchorText.trim())) {
    //         meaningLessTextInAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if (!hrefAttribute || hrefAttribute.trim() === '') {
    //         emptyHrefInAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if ((!hrefAttribute || !/^https?:\/\/|^www\./i.test(hrefAttribute) || specialCharRegex.test(hrefAttribute)) || specialCharRegex.test(anchorText)) {
    //         invalidHrefAnchors.push($anchor.toString());
    //         return;
    //     }
    //     issueFreeAnchors.push($anchor.toString());
    // });












    //anchor tag er moddhe # thake check korbe and jodi anchor tag er moddhe image tag thake tahole check korbe with proper alt attribute
    // anchorTags.each(function () {
    //     anchorCount++;
    //     const $anchor = $(this);
    //     const anchorText = $anchor.text().trim();
    //     const hrefAttribute = $anchor.attr('href');
    //     const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    //     const containsImage = $anchor.find('img').length > 0;
    //     if (hrefAttribute === '#') {
    //         if (!anchorText) {
    //             emptyAnchors.push($anchor.toString());
    //             return;
    //         }
    //         if (anchorText && specialCharRegex.test(anchorText)) {
    //             invalidHrefAnchors.push($anchor.toString());
    //             return;
    //         }
    //         issueFreeAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if (containsImage) {
    //         const $imgTag = $anchor.find('img');
    //         const imgSrc = $imgTag.attr('src');
    //         const imgAlt = $imgTag.attr('alt');
    //         if (imgSrc && imgSrc.trim() !== '' && imgAlt && imgAlt.trim() !== '') {
    //             issueFreeAnchors.push($anchor.toString());
    //             return;
    //         }
    //     }
    //     if (!anchorText) {
    //         emptyAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if (altRegexAnchor.test(anchorText.trim())) {
    //         meaningLessTextInAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if (!hrefAttribute || hrefAttribute.trim() === '') {
    //         emptyHrefInAnchors.push($anchor.toString());
    //         return;
    //     }
    //     if ((!hrefAttribute || !/^https?:\/\/|^www\./i.test(hrefAttribute) || specialCharRegex.test(hrefAttribute)) || specialCharRegex.test(anchorText)) {
    //         invalidHrefAnchors.push($anchor.toString());
    //         return;
    //     }
    //     issueFreeAnchors.push($anchor.toString());
    // });














    anchorTags.each(function () {
        anchorCount++;
        const $anchor = $(this);
        const anchorText = $anchor.text().trim();
        const hrefAttribute = $anchor.attr('href');
        const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
        const containsImage = $anchor.find('img').length > 0;
        if (containsImage) {
            if (!hrefAttribute || hrefAttribute.trim() === '') {
                emptyHrefInAnchors.push($anchor.toString());
                return;
            }
            const $img = $anchor.find('img');
            const altAttribute = $img.attr('alt');
            if (!altAttribute || altAttribute.trim() === '' || specialCharRegex.test(altAttribute)) {
                anchorNotContainImageProperly.push($anchor.toString());
                return;
            }
            issueFreeAnchors.push($anchor.toString());
            return;
        }
        // if (hrefAttribute === '#') {
        //     if (!anchorText || specialCharRegex.test(anchorText)) {
        //         invalidHrefAnchors.push($anchor.toString());
        //         return;
        //     }
        //     issueFreeAnchors.push($anchor.toString());
        //     return;
        // }
        if (!anchorText) {
            emptyAnchors.push($anchor.toString());
            return;
        }
        if (altRegexAnchor.test(anchorText.trim())) {
            meaningLessTextInAnchors.push($anchor.toString());
            return;
        }
        if (!hrefAttribute || hrefAttribute.trim() === '') {
            emptyHrefInAnchors.push($anchor.toString());
            return;
        }
        if (!/^https?:\/\/|^www\./i.test(hrefAttribute) || specialCharRegex.test(anchorText)) {
            invalidHrefAnchors.push($anchor.toString());
            return;
        }
        issueFreeAnchors.push($anchor.toString());
    });



    if (emptyButtons.length === 0 && meaningLessTextInButtons.length === 0) {
        console.log('*********************** Button Summary ***********************');
        console.log("There is no empty button that contains no text in the code.");
    } else {
        console.log('\n');
        console.log('*********************** Button Summary ***********************');

        //empty buttons
        console.log("Total empty buttons or has no value text found:", emptyButtons.length);
        emptyButtons.map(singleButton => {
            console.log(singleButton);
        });

        if (emptyButtons.length > 0) {
            console.log("#### Solution: Don't let the button be empty. Add Text to the button.");
        }

        //Special character in button name
        console.log('\n')
        console.log("Total meaning less texts in buttons found:", meaningLessTextInButtons.length);
        meaningLessTextInButtons.map(singleButton => {
            console.log(singleButton);
        });
        if (meaningLessTextInButtons.length > 0) {
            console.log("#### Solution: Give a specific text to the button. Don't add meaningless texts");
        }

        //Issue free buttons
        console.log('\n')
        console.log("Total Issue Free Buttons:", issueFreeButtons.length);
        issueFreeButtons.map(singleButton => {
            console.log(singleButton);
        });
    }


    // Calculate performance percentage of Buttons
    const totalButtons = buttonCount;
    const totalButtonsWithIssues = totalButtons - issueFreeButtons.length;
    let performancePercentageButtons;
    if (totalButtons > 0) {
        performancePercentageButtons = ((issueFreeButtons.length / totalButtons) * 100).toFixed(2) + '%';
    } else {
        performancePercentageButtons = "Can't Calculate Performance as there is no button";
    }
    console.log('\n');
    console.log("Total Buttons Found: ", buttonCount);
    console.log("Total Issue Free Buttons: ", issueFreeButtons.length);
    console.log("Total", buttonCount + " Buttons found and among them ", totalButtonsWithIssues + " Buttons have issues");
    console.log("Buttons Performance percentage:", performancePercentageButtons);

    console.log('\n');
    const emptyButton1 = 'https://webaim.org/standards/wcag/checklist#sc2.4.4'
    const emptyButton2 = 'https://webaim.org/standards/wcag/checklist#sc1.1.1'
    const moreGuidelineButton = 'https://www.w3.org/WAI/perspective-videos/controls/'
    if (emptyButtons.length > 0 || meaningLessTextInButtons.length > 0) {
        console.log('---------- WCAG Guidelines For Button Text ------------')
        console.log('Guideline for empty text in button:', emptyButton1);
        console.log('Guideline 2 for button:', emptyButton2);
        console.log('More Guidelines for button:', moreGuidelineButton);
    }

    if (emptyAnchors.length === 0 && meaningLessTextInAnchors.length === 0 && emptyHrefInAnchors.length === 0) {
        console.log('*********************** Anchor Summary ***********************');
        console.log("There is no empty anchor tag that contains no text in the code.");
    } else {
        console.log('\n')
        console.log('*********************** Anchor Summary ***********************');

        // anchor tags with no text
        console.log("Total number of anchor tags with no text:", emptyAnchors.length);
        emptyAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (emptyAnchors.length > 0) {
            console.log("#### Solution: Add a proper text to the anchor that defines what this anchor tag is about (if proper href is provided)");
        }

        // empty href in anchor tags
        console.log('\n')
        console.log("Total Anchors with No href or empty href:", emptyHrefInAnchors.length);
        emptyHrefInAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (emptyHrefInAnchors.length > 0) {
            console.log("#### Solution: Add href to the anchor tag if it is missing. If there is href than don't put it empty. Give a proper destination link in the href");
        }

        //Invalid href in anchor tag or contains special characters in it
        console.log('\n')
        console.log("Total Anchors with Invalid or meaning less text in href:", invalidHrefAnchors.length);
        invalidHrefAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (invalidHrefAnchors.length > 0) {
            console.log("#### Solution: Don't use invalid or  meaning less texts or links in href. Use a proper href link instead");
        }

        //Anchor Tag has images with issues
        console.log('\n')
        console.log("Anchor Tag Contains Image With Issues:", anchorNotContainImageProperly.length);
        anchorNotContainImageProperly.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (anchorNotContainImageProperly.length > 0) {
            console.log("#### Solution: Check the alt attribute if missing,  and use proper names to the alt attribute");
        }


        //Issue free anchor tags
        console.log('\n')
        console.log("Total Issue Free Anchor Tags:", issueFreeAnchors.length);
        issueFreeAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });

        // console.log('\n')
        // console.log("Total meaning less texts in anchor tag:", meaningLessTextInAnchors.length);
        // meaningLessTextInAnchors.map(singleAnchor => {
        //     console.log(singleAnchor);
        // });
    }


    // Calculate performance percentage of Anchors
    const totalAnchors = anchorCount;
    const totalAnchorsWithIssues = anchorCount - issueFreeAnchors.length;
    let performancePercentageAnchors;
    if (totalAnchors > 0) {
        performancePercentageAnchors = ((issueFreeAnchors.length / totalAnchors) * 100).toFixed(2) + '%';
    } else {
        performancePercentageAnchors = "Can't Calculate Performance as there is no anchor tag";
    }
    console.log('\n');
    console.log("Total Anchors Found: ", anchorCount);
    console.log("Total Issue Free Anchors: ", issueFreeAnchors.length);
    console.log("Total", anchorCount + " Anchors found and among them ", totalAnchorsWithIssues + " Anchors have issues");
    console.log("Anchors Performance percentage:", performancePercentageAnchors);


    console.log('\n');
    const anchorLinkGuideline = 'https://webaim.org/standards/wcag/checklist#sc2.4.4'
    const moreGuidelineLink = 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html'
    if (emptyAnchors.length > 0 || emptyHrefInAnchors.length > 0 || invalidHrefAnchors.length > 0 || meaningLessTextInAnchors.length > 0) {
        console.log('---------- WCAG Guidelines For link ------------')
        console.log('Guideline for empty text in Link:', anchorLinkGuideline);
        console.log('More Guidelines for Link:', moreGuidelineLink);
    }







    const forms = $('form');
    let totalForms = forms.length;
    console.log('\n')
    console.log("Total forms found in this code:", totalForms);


    // Form function that was used before
    // forms.each(function (index) {
    //     const form = $(this);
    //     const formLabels = form.find('label');
    //     const formInputs = form.find('input, select, textarea, option, fieldset');
    //     let emptyLabels = [];
    //     formLabels.each(function () {
    //         const labelText = $(this).text().trim();
    //         if (!labelText) {
    //             emptyLabels.push($(this).toString());
    //         }
    //     });
    //     let missingTypeAttributes = [];
    //     formInputs.each(function () {
    //         const inputType = $(this).attr('type');
    //         if (!inputType || inputType.trim() === '' || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(inputType)) {
    //             missingTypeAttributes.push($(this).toString());
    //         }
    //     });
    //     console.log('\n')
    //     console.log("************** Form " + (index + 1) + "  **************");
    //     if (emptyLabels.length === 0) {
    //         console.log("No empty labels found in this form.");
    //     } else {
    //         console.log("Total number of empty labels in this form found:", emptyLabels.length);
    //         emptyLabels.forEach(singleLabel => {
    //             console.log(singleLabel);
    //         });
    //         console.log('\n');
    //         const formGuideline = 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
    //         const formGuidelineMore = 'https://www.w3.org/WAI/tutorials/forms/labels/'
    //         console.log('---------- WCAG Guidelines For Form ------------')
    //         console.log('Guideline for Form:', formGuideline);
    //         console.log('More Guidelines for Form:', formGuidelineMore);
    //     }
    //     if (missingTypeAttributes.length > 0) {
    //         console.log('\n');
    //         console.log("Total number of input fields with missing or invalid type attribute:", missingTypeAttributes.length);
    //         missingTypeAttributes.forEach(inputField => {
    //             console.log(inputField);
    //         });
    //         console.log('\n');
    //         console.log('---------- WCAG Guidelines For Input Field Type Attribute ------------')
    //         console.log('Guideline for missing or invalid type attribute:', 'https://www.w3.org/WAI/WCAG21/quickref/#input-purposes');
    //     }
    // });























    //New Form Function 
    forms.each(function (index) {
        const form = $(this);
        const formLabels = form.find('label');
        const formInputs = form.find('input, select, textarea, option, fieldset');

        let emptyLabels = [];
        let labelsWithSpecialCharacters = [];
        let issueLessFormLabel = [];
        let missingTypeAttributesInInputField = [];
        let labeledInputFields = 0;

        // Check labels for empty text or special characters
        formLabels.each(function () {
            const labelText = $(this).text().trim();
            const forAttribute = $(this).attr('for');
            if (!labelText) {
                emptyLabels.push($(this).toString());
            } else if (/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(labelText)) {
                labelsWithSpecialCharacters.push($(this).toString());
            } else if (labelText && labelText.trim() !== '' && forAttribute && forAttribute.trim() !== '') {
                issueLessFormLabel.push($(this).toString());
            }
            else {
                // issueLessFormLabel.push($(this).toString());
            }
        });

        // Check the mismatched with the type attribute of an input field.
        formInputs.each(function () {
            const inputType = $(this).attr('type');
            if (!inputType || inputType.trim() === '' || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(inputType)) {
                missingTypeAttributesInInputField.push($(this).toString());
            }
        });

        // Count labeled input fields
        formInputs.each(function () {
            const input = $(this);
            const inputParent = input.parent();
            const associatedLabel = inputParent.is('label') ? inputParent : inputParent.find('label');
            if (associatedLabel.length > 0) {
                labeledInputFields++;
            }
        });

        console.log('\n')
        console.log("************** Form " + (index + 1) + "  **************");

        // Type related issues of input fields
        if (missingTypeAttributesInInputField.length > 0) {
            console.log('\n');
            console.log("Total number of input fields with missing or invalid type attribute:", missingTypeAttributesInInputField.length);
            missingTypeAttributesInInputField.forEach(inputField => {
                console.log(inputField);
            });
            console.log('#### Solution: Add type attribute and give proper value that defines what the input field is about.');
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same...")
        } else {
            console.log('\n')
            console.log("No type issues of input fields in this form.");
        }

        // Empty labels
        if (emptyLabels.length > 0) {
            console.log('\n')
            console.log("Total number of empty labels in this form found:", emptyLabels.length);
            emptyLabels.forEach(singleLabel => {
                console.log(singleLabel);
            });
            console.log("#### Solution: Don't put the form labels empty. Use propr name instead");
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same...")
        } else {
            console.log('\n')
            console.log("No empty labels found in this form.");
        }

        // Labels with special characters
        if (labelsWithSpecialCharacters.length > 0) {
            console.log('\n');
            console.log("Total number of labels with special characters (Meaningless characters) in this form found:", labelsWithSpecialCharacters.length);
            labelsWithSpecialCharacters.forEach(singleLabel => {
                console.log(singleLabel);
            });
            console.log("#### Solution: Don't use meaningless text in form labels. It does not define what the inout put about");
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same...")
        } else {
            console.log('\n')
            console.log("No labels found with special characters in this form.");
        }

        // Issue less Form Labels
        if (issueLessFormLabel.length > 0) {
            console.log('\n')
            console.log("Total number of Issue free labels in this form:", issueLessFormLabel.length);
            issueLessFormLabel.forEach(singleLabel => {
                console.log(singleLabel);
            });
        } else {
            console.log('\n')
            console.log("No issue free labels found in this form.");
        }

        // Input fields without labels
        const totalInputFields = formInputs.length;
        const inputFieldsWithLabels = labeledInputFields;
        const inputFieldsWithoutLabels = totalInputFields - inputFieldsWithLabels;
        console.log('\n');
        console.log("Total number of input fields in this form:", totalInputFields);
        console.log("Number of input fields with labels:", inputFieldsWithLabels);
        console.log("Number of input fields without labels:", inputFieldsWithoutLabels);
        console.log("Total number of labels in this form:", formLabels.length);

        if (emptyLabels.length > 0 || labelsWithSpecialCharacters.length > 0 || issueLessFormLabel.length > 0 || labeledInputFields > 0 || missingTypeAttributesInInputField.length.length > 0) {
            console.log('\n');
            const formGuideline = 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
            const formGuidelineMore = 'https://www.w3.org/WAI/tutorials/forms/labels/'
            console.log('---------- WCAG Guidelines For Form ------------')
            console.log('Guideline for Form:', formGuideline);
            console.log('More Guidelines for Form:', formGuidelineMore);
        }
    });







    // Code for checking the multiple form labels.
    let inputLabels = {}; // Object to store input labels and associated form labels
    forms.each(function (index) {
        const form = $(this);
        const formLabels = form.find('label');
        const formInputs = form.find('input, select, textarea, option, fieldset');
        formLabels.each(function () {
            const labelText = $(this).text().trim();
            if (!labelText) {
                const inputId = $(this).attr('for');
                if (inputId) {
                    if (!inputLabels[inputId]) {
                        inputLabels[inputId] = {
                            count: 1,
                            forms: [index + 1]
                        };
                    } else {
                        inputLabels[inputId].count++;
                        if (!inputLabels[inputId].forms.includes(index + 1)) {
                            inputLabels[inputId].forms.push(index + 1);
                        }
                    }
                }
            }
        });
    });




    // console the results
    console.log('\n')
    Object.keys(inputLabels).forEach(inputId => {
        const labelInfo = inputLabels[inputId];
        if (labelInfo.count > 1) {
            console.log(`Input label with ID "${inputId}" has multiple form labels associated with form ${labelInfo.forms.join(', ')}`);
        }
    });
}






// function for checking the issues(Missing alt attribute, Empty alt attribute, Issue less alt attribute) with alt attributes of image tag
console.log('\n')
console.log('*********************** Image Summary ***********************');
function findImagesWithoutAlt(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const imgTags = $('img');
    let undefinedAltCount = 0;
    let emptyAltCount = 0;
    let issueLessImageTagCount = 0;
    let meaningLessTextInAltCount = 0;
    const altRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;

    imgTags.each(function () {
        const altAttribute = $(this).attr('alt');
        if (altAttribute === undefined) {
            console.log('\n')
            undefinedAltCount++;
            console.log("Missing Alt attribute in image tag found in: \n", $(this).toString(), '\n');
            console.log("#### Solution: Add alt attribute to image tag and give a proper alt attribute name")
        }
        else if (altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')) {
            console.log('\n')
            emptyAltCount++;
            console.log("Empty Alt attribute in image tag found in: \n", $(this).toString(), '\n');
            console.log("#### Solution: Don't put the alt attribute empty and give a proper alt attribute name")
        }
        else if (altRegex.test(altAttribute.trim())) {
            console.log('\n')
            meaningLessTextInAltCount++;
            console.log("Alt attribute contains special characters in image tag found in: \n", $(this).toString(), '\n');
            console.log("#### Solution: Don't give meaningless/invalid names to alt attribute, give a proper alt attribute name instead")
        }
        else {
            console.log('\n')
            issueLessImageTagCount++;
            console.log("Issue less image tag found in: \n", $(this).toString(), '\n');
        }
    });
    return { undefinedAltCount, emptyAltCount, issueLessImageTagCount, meaningLessTextInAltCount };
}




// Read the file that we want to check accessibility issue
fs.readFile('../index.html', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    // *************** coder for showing issues with alt attributes of image tags ***************

    // Extract HTML content from JSX
    const htmlContent = data.match(/<div[^>]*>(.*?)<\/div>/gs);
    let totalUndefinedAltCount = 0;
    let totalEmptyAltCount = 0;
    let totalIssueLessImageTagCount = 0;
    let totalMeaningLessTextInAltCount = 0;
    htmlContent.forEach((content) => {
        const { undefinedAltCount, emptyAltCount, issueLessImageTagCount, meaningLessTextInAltCount } = findImagesWithoutAlt(content);
        totalUndefinedAltCount += undefinedAltCount;
        totalEmptyAltCount += emptyAltCount;
        totalIssueLessImageTagCount += issueLessImageTagCount;
        totalMeaningLessTextInAltCount += meaningLessTextInAltCount;
    });
    if (totalUndefinedAltCount === 0 && totalEmptyAltCount === 0 && totalIssueLessImageTagCount === 0 && totalMeaningLessTextInAltCount === 0) {
        console.log("Total number of image tags that do not have alt attributes:", 0);
        console.log("Total number of image tags with empty alt attributes:", 0);
        console.log("Total number of meaning less text in alt attributes:", 0);
        console.log("Total number of image tags that are issue free:", 0);
    } else {
        // Calculate performance percentage of Images
        const totalImages = totalUndefinedAltCount + totalEmptyAltCount + totalIssueLessImageTagCount + totalMeaningLessTextInAltCount;
        const issueFreeImages = totalIssueLessImageTagCount;
        const totalIssues = totalImages - issueFreeImages;

        let performancePercentageImages;
        if (totalImages > 0) {
            performancePercentageImages = ((issueFreeImages / totalImages) * 100).toFixed(2) + '%';
        } else {
            performancePercentageImages = "Can't Calculate Performance as there is no Image";
        }

        console.log("Total Images Found: ", totalImages);
        console.log("Total number of image tags that do not have alt attributes:", totalUndefinedAltCount);
        console.log("Total number of image tags with empty alt attributes:", totalEmptyAltCount);
        console.log("Total number of meaning less text in alt attributes:", totalMeaningLessTextInAltCount);
        console.log("Total number of image tags that are issue free:", totalIssueLessImageTagCount);
        console.log('\n');
        console.log("Total", totalImages + " Images found and among them ", totalIssues + " Images have issues");
        console.log("Image Performance percentage:", performancePercentageImages);


        console.log('\n');
        const nullOrEmptyTextOrMissingAltImage = 'https://webaim.org/standards/wcag/checklist#sc1.1.1'
        const howToSolveThisIssue = 'https://www.w3.org/WAI/WCAG20/quickref/20160105/#text-equiv-all'
        if (totalUndefinedAltCount > 0 || totalEmptyAltCount > 0 || totalMeaningLessTextInAltCount > 0) {
            console.log('---------- WCAG Guidelines For Image Alt Attribute------------')
            console.log('Guidelines for null or empty or suspicious alt text: ', nullOrEmptyTextOrMissingAltImage)
            console.log('Guidelines for how to Meet 1.1.1 (Non-text Content): ', howToSolveThisIssue)
        }



    }

    // call the function for showing issues of buttons, anchor tags, form label 
    findEmptyButtonsAndEmptyAnchorLink(data);
});




























