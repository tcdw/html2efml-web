(function() {
    'use strict';
    function dom2efml(e, ref) {
        if (ref === undefined) {
            ref = {};
        };
        var spaces = ref.spaces;
        if (spaces === undefined) {
            spaces = '    ';
        }
        var ignoreEmptyTextNode = ref.ignoreEmptyTextNode;
        if (ignoreEmptyTextNode === undefined) {
            ignoreEmptyTextNode = true;
        }
        var element = e instanceof Element ? e : document.querySelector(e);
        var nodeTypeMap = {
            1: 'ELEMENT_NODE',
            2: 'ATTRIBUTE_NODE',
            3: 'TEXT_NODE',
            4: 'CDATA_SECTION_NODE',
            5: 'ENTITY_REFERENCE_NODE',
            6: 'ENTITY_NODE',
            7: 'PROCESSING_INSTRUCTION_NODE',
            8: 'COMMENT_NODE',
            9: 'DOCUMENT_NODE',
            10: 'DOCUMENT_TYPE_NODE',
            11: 'DOCUMENT_FRAGMENT_NODE',
            12: 'NOTATION_NODE',
        };
        var output = '';
        /**
         * @param {Element} element
         * @param {number} indent
         */
        function recursive(element, indent) {
            if (indent === undefined) {
                indent = 0;
            }
            output += (spaces.repeat(indent)) + ">" + (element.tagName.toLowerCase()) + "\n";
            Array.prototype.forEach.call(element.attributes, function (e) {
                output += (spaces.repeat(indent + 1)) + "#" + (e.name) + " = " + (e.value) + "\n";
            });
            Array.prototype.forEach.call(element.childNodes, function (e) {
                switch (e.nodeType) {
                    case Node.ELEMENT_NODE: {
                        recursive(e, indent + 1);
                        break;
                    }
                    case Node.TEXT_NODE: {
                        if (!ignoreEmptyTextNode || e.textContent.trim() !== '') {
                            output += (spaces.repeat(indent + 1)) + "." + (e.textContent) + "\n";
                        }
                        break;
                    }
                    default: {
                        console.warn(("The nodeType value is " + (e.nodeType) + " (" + (nodeTypeMap[e.nodeType]) + "), which didn't handled by dom2efml"));
                        break;
                    }
                }
            });
        };
        recursive(element);
        return output;
    }
    var userInput = document.getElementById('user-input');
    var userOutput = document.getElementById('user-output');
    var userConvert = document.getElementById('user-convert');
    userConvert.addEventListener('click', function act() {
        var result = '';
        var parser = new DOMParser();
        var data = parser.parseFromString(userInput.value, 'text/html');
        Array.prototype.forEach.call(data.body.childNodes, function loop(e) {
            result += dom2efml(e);
        })
        userOutput.value = result;
    });
})();