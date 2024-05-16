const fs = require('fs');
const cheerio = require('cheerio');

let totalButtons = 0;
let totalButtonsWithIssues = 0;
let totalIssueFreeButtons = 0;

let totalAnchors = 0;
let totalAnchorsWithIssues = 0;
let totalIssueFreeAnchors = 0;

let totalForms = 0;
let totalInputFieldsCount = 0;
let totalInputFieldsIssueCount = 0;
let totalLabelsCount = 0;
let totalLabelsIssueCount = 0;

let totalImages = 0;
let totalImagesWithIssues = 0;
let totalIssueFreeImages = 0;

let issueDetails = {
    buttons: [],
    anchors: [],
    forms: [],
    images: []
};

function findEmptyButtonsAndEmptyAnchorLink(htmlContent) {
    const $ = cheerio.load(htmlContent);

    const buttonTags = $('button');
    const anchorTags = $('a');

    let emptyButtons = [];
    let meaningLessTextInButtons = [];
    let issueFreeButtons = [];

    let emptyAnchors = [];
    let meaningLessTextInAnchors = [];
    let emptyHrefInAnchors = [];
    let invalidHrefAnchors = [];
    let issueFreeAnchors = [];
    let anchorNotContainImageProperly = [];

    const altRegexButton = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    const altRegexAnchor = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;

    buttonTags.each(function () {
        totalButtons++;
        const buttonText = $(this).text().trim();
        if (!buttonText) {
            emptyButtons.push($(this).toString());
            totalButtonsWithIssues++;
            issueDetails.buttons.push({ issue: 'Empty Button', element: $(this).toString() });
            return;
        }
        if (altRegexButton.test(buttonText.trim())) {
            meaningLessTextInButtons.push($(this).toString());
            totalButtonsWithIssues++;
            issueDetails.buttons.push({ issue: 'Button with meaningless text', element: $(this).toString() });
            return;
        }
        issueFreeButtons.push($(this).toString());
        totalIssueFreeButtons++;
    });

    anchorTags.each(function () {
        totalAnchors++;
        const $anchor = $(this);
        const anchorText = $anchor.text().trim();
        const hrefAttribute = $anchor.attr('href');
        const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
        const containsImage = $anchor.find('img').length > 0;
        if (containsImage) {
            if (!hrefAttribute || hrefAttribute.trim() === '') {
                emptyHrefInAnchors.push($anchor.toString());
                totalAnchorsWithIssues++;
                issueDetails.anchors.push({ issue: 'Anchor with image and empty href', element: $(this).toString() });
                return;
            }
            const $img = $anchor.find('img');
            const altAttribute = $img.attr('alt');
            if (!altAttribute || altAttribute.trim() === '' || specialCharRegex.test(altAttribute)) {
                anchorNotContainImageProperly.push($anchor.toString());
                totalAnchorsWithIssues++;
                issueDetails.anchors.push({ issue: 'Anchor with image and improper alt attribute', element: $(this).toString() });
                return;
            }
            issueFreeAnchors.push($anchor.toString());
            totalIssueFreeAnchors++;
            return;
        }
        if (!anchorText) {
            emptyAnchors.push($anchor.toString());
            totalAnchorsWithIssues++;
            issueDetails.anchors.push({ issue: 'Empty Anchor', element: $(this).toString() });
            return;
        }
        if (altRegexAnchor.test(anchorText.trim())) {
            meaningLessTextInAnchors.push($anchor.toString());
            totalAnchorsWithIssues++;
            issueDetails.anchors.push({ issue: 'Anchor with meaningless text', element: $(this).toString() });
            return;
        }
        if (!hrefAttribute || hrefAttribute.trim() === '') {
            emptyHrefInAnchors.push($anchor.toString());
            totalAnchorsWithIssues++;
            issueDetails.anchors.push({ issue: 'Anchor with empty href attribute', element: $(this).toString() });
            return;
        }
        if (!/^https?:\/\/|^www\./i.test(hrefAttribute) || specialCharRegex.test(anchorText)) {
            invalidHrefAnchors.push($anchor.toString());
            totalAnchorsWithIssues++;
            issueDetails.anchors.push({ issue: 'Anchor with invalid href', element: $(this).toString() });
            return;
        }
        issueFreeAnchors.push($anchor.toString());
        totalIssueFreeAnchors++;
    });

    // Button summary
    console.log('\n*********************** Button Summary ***********************');
    console.log("Total Buttons Found: ", totalButtons);
    console.log("Total Issue Free Buttons: ", totalIssueFreeButtons);
    console.log("Total Buttons with Issues: ", totalButtonsWithIssues);

    // Calculate performance percentage of Buttons
    let performancePercentageButtons;
    if (totalButtons > 0) {
        performancePercentageButtons = ((totalIssueFreeButtons / totalButtons) * 100).toFixed(2) + '%';
    } else {
        performancePercentageButtons = "Can't Calculate Performance as there is no button";
    }
    console.log("Buttons Accuracy percentage:", performancePercentageButtons);

    // Anchor summary
    console.log('\n*********************** Anchor Summary ***********************');
    console.log("Total Anchors Found: ", totalAnchors);
    console.log("Total Issue Free Anchors: ", totalIssueFreeAnchors);
    console.log("Total Anchors with Issues: ", totalAnchorsWithIssues);

    // Calculate performance percentage of Anchors
    let performancePercentageAnchors;
    if (totalAnchors > 0) {
        performancePercentageAnchors = ((totalIssueFreeAnchors / totalAnchors) * 100).toFixed(2) + '%';
    } else {
        performancePercentageAnchors = "Can't Calculate Performance as there is no anchor tag";
    }
    console.log("Anchors Accuracy percentage:", performancePercentageAnchors);

    const forms = $('form');
    totalForms += forms.length;

    forms.each(function (index) {
        const form = $(this);
        const formLabels = form.find('label');
        const formInputs = form.find('input, select, textarea, option, fieldset');

        let emptyLabels = [];
        let labelsWithSpecialCharacters = [];
        let issueLessFormLabel = [];
        let missingTypeAttributesInInputField = [];
        let labeledInputFields = 0;

        formLabels.each(function () {
            const labelText = $(this).text().trim();
            const forAttribute = $(this).attr('for');
            if (!labelText) {
                emptyLabels.push($(this).toString());
                totalLabelsIssueCount++;
                issueDetails.forms.push({ issue: 'Empty Label', element: $(this).toString() });
            } else if (/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(labelText)) {
                labelsWithSpecialCharacters.push($(this).toString());
                totalLabelsIssueCount++;
                issueDetails.forms.push({ issue: 'Label with special characters', element: $(this).toString() });
            } else if (labelText && labelText.trim() !== '' && forAttribute && forAttribute.trim() !== '') {
                issueLessFormLabel.push($(this).toString());
            }
        });

        formInputs.each(function () {
            const inputType = $(this).attr('type');
            if (!inputType || inputType.trim() === '' || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(inputType)) {
                missingTypeAttributesInInputField.push($(this).toString());
                totalInputFieldsIssueCount++;
                issueDetails.forms.push({ issue: 'Input field with missing or invalid type attribute', element: $(this).toString() });
            }
        });

        formInputs.each(function () {
            const input = $(this);
            const inputParent = input.parent();
            const associatedLabel = inputParent.is('label') ? inputParent : inputParent.find('label');
            if (associatedLabel.length > 0) {
                labeledInputFields++;
            }
        });

        console.log('\n************** Form ' + (index + 1) + ' **************');
        if (missingTypeAttributesInInputField.length > 0) {
            console.log("Total number of input fields with missing or invalid type attribute:", missingTypeAttributesInInputField.length);
            missingTypeAttributesInInputField.forEach(inputField => console.log(inputField));
        } else {
            console.log("No type issues of input fields in this form.");
        }

        if (emptyLabels.length > 0) {
            console.log("Total number of empty labels in this form found:", emptyLabels.length);
            emptyLabels.forEach(singleLabel => console.log(singleLabel));
        } else {
            console.log("No empty labels found in this form.");
        }

        if (labelsWithSpecialCharacters.length > 0) {
            console.log("Total number of labels with special characters in this form found:", labelsWithSpecialCharacters.length);
            labelsWithSpecialCharacters.forEach(singleLabel => console.log(singleLabel));
        } else {
            console.log("No labels found with special characters in this form.");
        }

        totalInputFieldsCount += formInputs.length;
        totalLabelsCount += formLabels.length;
    });

    // Forms summary
    console.log('\n*********************** Form Summary ***********************');
    console.log("Total Forms Found: ", totalForms);
    console.log("Total Input Fields Found: ", totalInputFieldsCount);
    console.log("Total Labels Found: ", totalLabelsCount);
    console.log("Total Input Fields with Issues: ", totalInputFieldsIssueCount);
    console.log("Total Labels with Issues: ", totalLabelsIssueCount);

    let performancePercentageForms;
    if (totalForms > 0) {
        let totalFormElements = totalInputFieldsCount + totalLabelsCount;
        let totalFormElementsWithIssues = totalInputFieldsIssueCount + totalLabelsIssueCount;
        performancePercentageForms = ((totalFormElements - totalFormElementsWithIssues) / totalFormElements * 100).toFixed(2) + '%';
    } else {
        performancePercentageForms = "Can't Calculate Performance as there is no form tag";
    }
    console.log("Forms Accuracy percentage:", performancePercentageForms);
}

function findImagesWithoutAlt(htmlContent) {
    const $ = cheerio.load(htmlContent);

    const imgTags = $('img');

    let imagesWithoutAlt = [];
    let imagesWithEmptyAlt = [];
    let imagesWithSpecialCharAlt = [];
    let issueFreeImages = [];

    imgTags.each(function () {
        totalImages++;
        const altAttribute = $(this).attr('alt');
        const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;

        if (altAttribute === undefined) {
            imagesWithoutAlt.push($(this).toString());
            totalImagesWithIssues++;
            issueDetails.images.push({ issue: 'Image without alt attribute', element: $(this).toString() });
        } else if (altAttribute.trim() === '') {
            imagesWithEmptyAlt.push($(this).toString());
            totalImagesWithIssues++;
            issueDetails.images.push({ issue: 'Image with empty alt attribute', element: $(this).toString() });
        } else if (specialCharRegex.test(altAttribute)) {
            imagesWithSpecialCharAlt.push($(this).toString());
            totalImagesWithIssues++;
            issueDetails.images.push({ issue: 'Image with special characters in alt attribute', element: $(this).toString() });
        } else {
            issueFreeImages.push($(this).toString());
            totalIssueFreeImages++;
        }
    });

    // Images summary
    console.log('\n************** Images Without Alt **************');
    imagesWithoutAlt.forEach(image => console.log(image));
    console.log('\n************** Images With Empty Alt **************');
    imagesWithEmptyAlt.forEach(image => console.log(image));
    console.log('\n************** Images With Special Character Alt **************');
    imagesWithSpecialCharAlt.forEach(image => console.log(image));

    console.log('\n************** Images Summary **************');
    console.log("Total Images Found: ", totalImages);
    console.log("Total Issue Free Images: ", totalIssueFreeImages);
    console.log("Total Images with Issues: ", totalImagesWithIssues);

    // Calculate performance percentage of Images
    let performancePercentageImages;
    if (totalImages > 0) {
        performancePercentageImages = ((totalIssueFreeImages / totalImages) * 100).toFixed(2) + '%';
    } else {
        performancePercentageImages = "Can't Calculate Performance as there is no image tag";
    }
    console.log("Images Accuracy percentage:", performancePercentageImages);
}

const htmlContent = fs.readFileSync('../index.html', 'utf-8');

findEmptyButtonsAndEmptyAnchorLink(htmlContent);
findImagesWithoutAlt(htmlContent);

// Final Evaluation Summary
console.log('\n*********************** Final Evaluation Summary ***********************');
console.log("Total Elements Analyzed:");
console.log("Total Buttons: ", totalButtons);
console.log("Total Anchors: ", totalAnchors);
console.log("Total Forms: ", totalForms);
console.log("Total Images: ", totalImages);

console.log('\nTotal Elements with Issues:');
console.log("Total Buttons with Issues: ", totalButtonsWithIssues);
console.log("Total Anchors with Issues: ", totalAnchorsWithIssues);
console.log("Total Input Fields with Issues: ", totalInputFieldsIssueCount);
console.log("Total Labels with Issues: ", totalLabelsIssueCount);
console.log("Total Images with Issues: ", totalImagesWithIssues);

let totalElementsWithIssues = totalButtonsWithIssues + totalAnchorsWithIssues + totalInputFieldsIssueCount + totalLabelsIssueCount + totalImagesWithIssues;
console.log("Total Elements with Issues: ", totalElementsWithIssues);

let totalElements = totalButtons + totalAnchors + totalForms + totalInputFieldsCount + totalLabelsCount + totalImages;
console.log("Total Elements: ", totalElements);

let overallPerformancePercentage = ((totalElements - totalElementsWithIssues) / totalElements * 100).toFixed(2) + '%';
console.log("Overall Accuracy Percentage: ", overallPerformancePercentage);

// Print issue details for each segment
console.log('\n*********************** Issue Details ***********************');

// Print button issues
console.log('\n************** Button Issues **************');
issueDetails.buttons.forEach(detail => console.log(`Issue: ${detail.issue}, Element: ${detail.element}`));

// Print anchor issues
console.log('\n************** Anchor Issues **************');
issueDetails.anchors.forEach(detail => console.log(`Issue: ${detail.issue}, Element: ${detail.element}`));

// Print form issues
console.log('\n************** Form Issues **************');
issueDetails.forms.forEach(detail => console.log(`Issue: ${detail.issue}, Element: ${detail.element}`));

// Print image issues
console.log('\n************** Image Issues **************');
issueDetails.images.forEach(detail => console.log(`Issue: ${detail.issue}, Element: ${detail.element}`));
