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








    const altRegexButton = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    const altRegexAnchor = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;



    // Code for checking the buttons and anchor tags that are empty. Means no text in the button and anchor tags

    buttonTags.each(function () {
        buttonCount++;
        const buttonText = $(this).text().trim();
        if (!buttonText) {
            emptyButtons.push($(this).toString());
        }
        if (altRegexButton.test(buttonText.trim())) {
            meaningLessTextInButtons.push($(this).toString());
        }
        if (!buttonText || altRegexButton.test(buttonText)) {
            // If button text is empty or contains meaningless regex text, skip
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





    //anchor tag er moddhe image thake check korte
    // anchorTags.each(function () {
    //     anchorCount++;
    //     const $anchor = $(this);
    //     const anchorText = $anchor.text().trim();
    //     const hrefAttribute = $anchor.attr('href');
    //     const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    //     const containsImage = $anchor.find('img').length > 0;
    //     if (containsImage) {
    //         issueFreeAnchors.push($anchor.toString());
    //         return;
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







    //anchor tag er moddhe # thake check korbe and jodi anchor tag er moddhe image tag thake tahole check korbe with proper alt attribute
    anchorTags.each(function () {
        anchorCount++;
        const $anchor = $(this);
        const anchorText = $anchor.text().trim();
        const hrefAttribute = $anchor.attr('href');
        const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
        const containsImage = $anchor.find('img').length > 0; // Check if anchor tag contains image tag


        if (hrefAttribute === '#') {
            // If anchor tag contains no name, consider it as an issue
            if (!anchorText) {
                emptyAnchors.push($anchor.toString());
                return;
            }
            if (anchorText && specialCharRegex.test(anchorText)) {
                invalidHrefAnchors.push($anchor.toString());
                return;
            }
            issueFreeAnchors.push($anchor.toString());
            return;
        }

        // If anchor tag contains an image tag
        if (containsImage) {
            const $imgTag = $anchor.find('img');
            const imgSrc = $imgTag.attr('src');
            const imgAlt = $imgTag.attr('alt');
            if (imgSrc && imgSrc.trim() !== '' && imgAlt && imgAlt.trim() !== '') {
                issueFreeAnchors.push($anchor.toString());
                return;
            }
        }

        // Proceed with other checks if anchor tag does not contain image tag or image tag doesn't have proper src and alt attributes
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
        // Check if href attribute exists and starts with a valid protocol or www., and anchor text doesn't contain only special characters
        if ((!hrefAttribute || !/^https?:\/\/|^www\./i.test(hrefAttribute) || specialCharRegex.test(hrefAttribute)) || specialCharRegex.test(anchorText)) {
            invalidHrefAnchors.push($anchor.toString());
            return;
        }
        // If all checks pass, the anchor is issue-free
        issueFreeAnchors.push($anchor.toString());
    });



























    if (emptyButtons.length === 0 && meaningLessTextInButtons.length === 0) {
        console.log('*********************** Button Summary ***********************');
        console.log("There is no empty button that contains no text in the code.");
    } else {
        console.log('\n');
        console.log('*********************** Button Summary ***********************');
        console.log("Total empty buttons or has no value text found:", emptyButtons.length);
        emptyButtons.map(singleButton => {
            console.log(singleButton);
        });
        console.log('\n')
        console.log("Total meaning less texts in buttons found:", meaningLessTextInButtons.length);
        meaningLessTextInButtons.map(singleButton => {
            console.log(singleButton);
        });
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
        console.log("Total number of anchor tags with no text:", emptyAnchors.length);
        emptyAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        console.log('\n')
        console.log("Total Anchors with No href or empty href:", emptyHrefInAnchors.length);
        emptyHrefInAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        console.log('\n')
        console.log("Total Anchors with Invalid or meaning less text in href:", invalidHrefAnchors.length);
        invalidHrefAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
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







    // Code for checking the form labels that are empty. Means no text in the form label 
    const forms = $('form');
    let totalForms = forms.length;
    console.log('\n')
    console.log("Total forms found in this code:", totalForms);
    forms.each(function (index) {
        const form = $(this);
        const formLabels = form.find('label');
        let emptyLabels = [];
        formLabels.each(function () {
            const labelText = $(this).text().trim();
            if (!labelText) {
                emptyLabels.push($(this).toString());
            }
        });
        console.log('\n')
        console.log("************** Form " + (index + 1) + "  **************");
        if (emptyLabels.length === 0) {
            console.log("No empty labels found in this form.");
        } else {
            console.log("Total number of empty labels in this form found:", emptyLabels.length);
            emptyLabels.map(singleLabel => {
                console.log(singleLabel);
            });
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

        // Iterate through each form label
        formLabels.each(function () {
            const labelText = $(this).text().trim();
            if (!labelText) {
                // If label is empty, add it to the emptyLabels array
                const inputId = $(this).attr('for');
                if (inputId) {
                    // If input ID is present
                    if (!inputLabels[inputId]) {
                        // If input label is encountered for the first time
                        inputLabels[inputId] = {
                            count: 1,
                            forms: [index + 1]
                        };
                    } else {
                        // If input label is already encountered
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
    console.log("Total forms found:", totalForms);
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
        }
        else if (altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')) {
            console.log('\n')
            emptyAltCount++;
            console.log("Empty Alt attribute in image tag found in: \n", $(this).toString(), '\n');
        }
        else if (altRegex.test(altAttribute.trim())) {
            console.log('\n')
            meaningLessTextInAltCount++;
            console.log("Alt attribute contains special characters in image tag found in: \n", $(this).toString(), '\n');
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
        console.log("Total number of image tags that are issue free:", 0);
        console.log("Total number of meaning less text in alt attributes:", 0);
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
        console.log("Total number of image tags that are issue free:", totalIssueLessImageTagCount);
        console.log("Total number of meaning less text in alt attributes:", totalMeaningLessTextInAltCount);
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




























