/**
 * Created by Sheldon Lee on 9/11/2016.
 */
/**
 *
 */
YUI.add('RealEstateUIEvents_js', function(Y) {
    var questionVO = {};
    var eventsLoc = {};
    var flowWrapper = Y.one('#flowWrapper');
    var replaceInnerHTMLObj = {};
    var dataObject = {citiesStatesMap:{}};
    var currentPage = undefined;
    var interstitialPanels = {};
    var liabilities = undefined;
    var multipleLiabilitiesContainer = undefined;
    var liabilitiesUnorderedList =	'<div class="pre-qual-checkbox-list-item">' +
        '<div class="pre-qual-checkbox-containers">' +
        '<input class="pre-qual-liability-checkbox" type="checkbox" name="include/exclude liability" id="liabilityCheckBox-{0}" {5}/>' +
        '</div>' +
        '<div class="pre-qual-checkbox-label-containers">' +
        '<label class="pre-qual-checkbox-label" for="liabilityCheckBox-{0}">' +
        '<span class="liability-company-name"><strong>{1} (-{2})</strong></span><br />' +
        '<span class="liability-info-content-containers">' +
        '<span class="liability-balance">Balance: $<span class="currency">{3}</span></span><br />'+
        '<span class="liability-payment">Payment: $<span class="currency">{4}</span></span>'+
        '</span>' +
        '</label>' +
        '</div>' +
        '</div>';
    var activeInterstitialPanel, activeInterstitialPanelData;
    var isDUResponseReceived = false;
    var siteCatLogObj = {};
    var liabilitiesObj = {};
    Y.namespace('USAA.bk.re.ui.RealEstateUI.events');

    var events = {
        updateObjectValue: function(e){
            var data = this.data;
            var event = this.event;
            if(event  && data){
                var eventParams = event.eventParams;
                if(eventParams){
                    if(eventParams.action && eventParams.resultsSelector && eventParams.targetAttribute  && eventParams.actionTargetSelector){
                        var currentTargetValue = this.data.container.get(eventParams.targetAttribute);//addtionalAsset
                        switch(eventParams.action){
                            case "ADDITION":
                                var result = Number(currentTargetValue);
                                if (isNaN(result)) {
                                    result = 0;
                                }
                                if (!isNaN(eventParams.multiplier)) {
                                    result = result * Number(eventParams.multiplier);
                                }
                                Y.all(eventParams.actionTargetSelector).each(function(node, index, array){
                                    var nodeValue = node.sourceValue ? node.sourceValue: node.get(eventParams.targetAttribute);
                                    if(!isNaN(nodeValue)){
                                        result += Number(nodeValue);
                                    }
                                });
                                /*Update Target and Backing JsonObject*/
                                Y.all(eventParams.resultsSelector).each(function(node, index, array){
                                    node.set(eventParams.targetAttribute, result);
                                    var nodeData = node.getData('data');
                                    if(nodeData && nodeData.inputName){
                                        questionVO[nodeData.inputName] = result.toString();
                                        nodeData.container.fire('replaceInnerHTMLInNodes', {target:nodeData.container});
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        },
        /**
         * This function will retrieve the height of the node
         * @param Y_NODE
         */
        getOriginalHeight: function(node) {
            /*if node is undefined, return 0;*/
            if (!node) {
                return 0;
            }

            if (node.hasClass('usaa-hidden')) {
                node.setStyle('width', node.ancestor().get('scrollWidth'));
                node.addClass('pre-qual-offscreenMeasure');
                node.removeClass('usaa-hidden');
                node.originalHeight = node.get('scrollHeight');
                node.addClass('usaa-hidden');
                node.removeClass('pre-qual-offscreenMeasure');
                node.setStyle('width', '');

                return node.originalHeight;
            } else {
                node.originalHeight = node.get('scrollHeight');

                return node.originalHeight;
            }
        },
        /**
         * this function will used to display question or hide question
         */
        showNode: function(e) {
            var data = this.data;
            var event = this.event;
            var params, showNode;
            var container;
            var isRadioOrCheckBox;

            /*stop function from executing if the data is null or empty*/
            if (!data || !event) {
                return;
            }

            params = event.eventParams;
//			if (this.isOptionContainer) {
//				containers = data.optionContainer;
//			} else {
            if (data.input) {
                isRadioOrCheckBox = true;
            } else {
                isRadioOrCheckBox = false;
            }

            container = data.container;

            /*check the eventParam condition*/
            showNode = checkEventParams.call(this, params);

            if (showNode) {
                if (container.hasClass('usaa-hidden')) {
                    Y.fire('showNodeAnim', {node:container, showNode:showNode});
                    if (isRadioOrCheckBox) {
                        Y.fire('showNodeAnim',{node:container.next('label'), showNode:showNode});
                        Y.fire('showNodeAnim',{node:container.next('br'), showNode:showNode});
                    }
                }
            } else {
                if (!container.hasClass('usaa-hidden')) {
                    Y.fire('showNodeAnim', {node:container, showNode:showNode});
                    if (isRadioOrCheckBox) {
                        Y.fire('showNodeAnim',{node:container.next('label'), showNode:showNode});
                        Y.fire('showNodeAnim',{node:container.next('br'), showNode:showNode});
                    }
                }
            }

        },
        /**
         * show node element without animation, this will simply remove the usaa-hidden class from the node.
         * it will search for the class and remove usaa-hidden class or add usaa-hidden class base on the condition rule
         *
         * @param e.cssSelector
         * @param e.opositeCssSelector
         * @param e.rule
         */
        showNodeWithoutAnim: function(e) {
            var showNode = false,
                cssSelector = '',
                oppostiteSelector = '';
            /*stop the function from executing if there css selector and rule are not presented in passed in variable.*/
            if (!this || (!this.event.eventParams.constructor === Array && !this.event.eventParams.cssSelector) || (!this.event.eventParams.constructor === Array && !this.event.eventParams.rule)) {
                return;
            }

            if(this.event.eventParams.constructor === Array){
                this.event.eventParams.some(function(obj, index, array){
                    showNode = checkEventParams.call(this, obj.rule);
                    if (showNode) {
                        cssSelector = obj.cssSelector;
                        oppostiteSelector = obj.opositeCssSelector;
                    }
                    return showNode;
                });
            }else{
                showNode = checkEventParams.call(this, this.event.eventParams.rule);
                cssSelector = this.event.eventParams.cssSelector;
                oppostiteSelector = this.event.eventParams.opositeCssSelector;
            }
            Y.all(cssSelector).each(function(node, index, array) {
                if (showNode) {
                    node.removeClass('usaa-hidden');
                    node.removeAttribute('aria-hidden');
                } else {
                    node.addClass('usaa-hidden');
                    node.setAttribute('aria-hidden', 'true');
                }
            });

            Y.all(oppostiteSelector).each(function(node, index, array) {
                if (showNode) {
                    node.addClass('usaa-hidden');
                    node.setAttribute('aria-hidden', 'true');
                } else {
                    node.removeClass('usaa-hidden');
                    node.removeAttribute('aria-hidden');
                }
            });
        },
        /**
         * this function will clear the backend for hiding a question
         */
        hideQuestionAnimStarted: function(e) {
            var question = e.node.getData('data');
            var input = question.realEstateUIInputVO;
            question.isHidden = !e.showNode;

            if (e.showNode) {
                if (e.node.getData('show-question-when-all-questions-answered') !== 'true') {
                    question.questionGroup.totalNumberOfQuestions++;
                }
            } else {
                if (input.question.container.getData('show-question-when-all-questions-answered') !== 'true') {
                    input.question.questionGroup.totalNumberOfQuestions--;
                }
                Y.fire('clearInputBackend', {input: input});
            }
        },
        /**
         * this function will clear all the inputs, all UI appearance changes.
         */
        hideQuestionAnimEnded: function(e) {
            var question, input;
            if (!e.showNode) {
                question = e.node.getData('data');

                input = question.realEstateUIInputVO;

                Y.fire('clearInputFrontend', {input: input});

                /*clear feedbackPanel if there are any error messages*/
                if (question.feedbackPanel) {
                    Y.fire('showNodeAnim', {node:question.feedbackPanel,showNode:false});
                }
            }
        },
        /**
         * This function will control the animation of the expanse and collapse
         * @param node
         * @param showNode
         * @param clearInput
         */
        showNodeAnim: function(e) {
            var expandCollapseAnim, currentHeight, futureHeight, currentOpacity, futureOpacity;

            if (!e || !e.node) {
                return;
            }

            /*calculating value for the animation*/
            if (e.showNode) {
                currentHeight = 0;
                futureHeight = events.getOriginalHeight(e.node);
                currentOpacity = 0;
                futureOpacity = 1;
            } else {
                currentHeight = events.getOriginalHeight(e.node);
                futureHeight = 0;
                currentOpacity = 1;
                futureOpacity = 0;
            }

            /*Instantiate the animation object from YUI*/
            expandCollapseAnim = new Y.Anim({
                node: e.node,
                from: {
                    height: currentHeight,
                    opacity: currentOpacity
                },
                to: {
                    height: futureHeight,
                    opacity: futureOpacity
                },
                easing: Y.Easing.easeOut,
                duration: 0.5
            });

            /*fire the following function when the animation started*/
            expandCollapseAnim.on('start', function() {
                e.node.isShowingNode = e.showNode;
                e.node.setStyles({
                    height: currentHeight,
                    opacity: currentOpacity
                });
                e.node.addClass('animation-started');
                if (e.showNode) {
                    e.node.removeClass('usaa-hidden');
                    e.node.removeAttribute('aria-hidden');
                    if (e.node.getData('data')) {
                        e.node.getData('data').container.fire('updateSliderLength');
                    }
                }

                e.node.fire('expandCollapseAnimStarted', e);
            });

            /*fire the following function when the animation ended*/
            expandCollapseAnim.on('end', function() {
                delete e.node.isShowingNode;
                if (e.showNode) {
                    e.node.setStyle('height', 'auto');
                } else {
                    e.node.addClass('usaa-hidden');
                    e.node.setAttribute('aria-hidden', true);
                }
                e.node.removeClass('animation-started');
                e.node.fire('expandCollapseAnimEnded', e);
            });

            /*execute the animation*/
            if (e.node.isShowingNode !== undefined) {
                if (e.node.isShowingNode !== e.showNode) {
                    setTimeout(function() {expandCollapseAnim.run();}, 300);
                }
            } else {
                expandCollapseAnim.run();
            }

        },
        /**
         * this function primarily will be used to show credit authorization question when member answered all questions.
         */
        showQuestionWhenAllQuestionsAnswered: function(e) {
            var data = this.data;
            var container;

            if (!data) {
                return;
            }

            if (this.isOptionContainer) {
                container = data.optionContainer;
            } else {
                container = data.container;
            }

            if (data.questionGroup.totalNumberOfQuestions - data.questionGroup.numberOfAnsweredQuestion <= 1) {
                if (data.isHidden) {
                    Y.fire('showNodeAnim', {node: container, showNode: true});
                }
            } else {
                if (!data.isHidden) {
                    Y.fire('showNodeAnim', {node: container, showNode: false});
                }
            }
        },
        scrollAndExpandNode: function(e) {
            var questionGroup, questionGroupContainer;

            if (!this || !this.event || !this.event.eventParams || !this.event.eventParams.cssSelector) {
                return;
            }

            questionGroupContainer = Y.one(this.event.eventParams.cssSelector);

            if (questionGroupContainer) {
                questionGroup = questionGroupContainer.getData('data');

                if (questionGroup) {
                    if (!questionGroup.isExpanded) {
                        Y.fire('showNodeAnim', {node:questionGroup.ecContainer,showNode:true});
                    }
                    Y.fire('scrollToNode', questionGroup);
                }
            }
        },
        /**
         * This function will do site catalyst logging.
         */
        logSiteCat: function(e) {
            var siteCatValue, value, compAttributeKeys;
            if (!this || !this.event || !this.event.eventParams) {
                return;
            }

            if (this.data) {
                value = retrieveValue(this.data, true);
            }

            if ((typeof e === 'string' || typeof e === 'number') && !value) {
                value = e.toString();
            }

            /*log question group that member is currently on*/
            logPage.call(this);
            /*check if the site catalyst is available*/
            if (USAA && USAA.ent) {
                if (USAA.ent.digitalData && USAA.ent.digitalData.component && USAA.ent.digitalData.component.attributes) {
                    /*if value is valid, construct siteCatValue. if not delete from site cat attributes*/
                    if (!siteCatLogObj[this.event.eventParams.page.pageDesc]) {
                        siteCatLogObj[this.event.eventParams.page.pageDesc] = {};
                    }
                    Y.mix(siteCatLogObj[this.event.eventParams.page.pageDesc], this.event.eventParams.component.attributes, true);
                    compAttributeKeys = Object.keys(this.event.eventParams.component.attributes);
                    if (value) {
                        for (var i = 0; i < compAttributeKeys.length; i++) {
                            siteCatLogObj[this.event.eventParams.page.pageDesc][compAttributeKeys[i]] = siteCatLogObj[this.event.eventParams.page.pageDesc][compAttributeKeys[i]] + value;
                        }
                    } else {
                        for (var i = 0; i < compAttributeKeys.length; i++) {
                            delete siteCatLogObj[this.event.eventParams.page.pageDesc][compAttributeKeys[i]];
                        }
                    }

                    if (dataObject.logSiteCatForEachQuestion) {
                        Y.mix(USAA.ent.digitalData.component.attributes, this.event.eventParams.component.attributes, true);
                        if (value) {
                            compAttributeKeys = Object.keys(this.event.eventParams.component.attributes);
                            for (var i = 0; i < compAttributeKeys.length; i++) {
                                USAA.ent.digitalData.component.attributes[compAttributeKeys[i]] = USAA.ent.digitalData.component.attributes[compAttributeKeys[i]] + value;
                            }
                        }
                    }
                }
                if (dataObject.logSiteCatForEachQuestion) {
                    /*log question in site cat*/
                    if (USAA.ent.DigitalAnalytics && USAA.ent.DigitalAnalytics.trackLink) {
                        USAA.ent.DigitalAnalytics.trackLink();
                        USAA.ent.digitalData.component.attributes = {};
                    }
                }
            }
        },
        /**
         * This will log the page
         */
        logSiteCatPage: function(e) {
            if (!this || !this.event || !this.event.eventParam) {
                return;
            }

            logPage.call(this);
        },
        logSiteCatQuestion: function(e) {
            var questionGroup;
            if (dataObject.logSiteCatForEachQuestion || !this || !this.event || !this.event.eventParams || !this.event.eventParams.page || !this.event.eventParams.page.pageDesc) {
                return;
            }

            if (this.data) {
                if (this.data.question) {
                    questionGroup = this.data.question.questionGroup;
                } else {
                    questionGroup = this.data;
                }
            }

            if (questionGroup === undefined || questionGroup.isQuestionGroupDirty) {
                if (USAA && USAA.ent) {
                    if (USAA.ent.digitalData && USAA.ent.digitalData.component && USAA.ent.digitalData.component.attributes) {
                        Y.mix(USAA.ent.digitalData.component.attributes, siteCatLogObj[this.event.eventParams.page.pageDesc], true);
                    }

                    /*log question in site cat*/
                    if (USAA.ent.DigitalAnalytics && USAA.ent.DigitalAnalytics.trackLink) {
                        USAA.ent.DigitalAnalytics.trackLink();
                        if (questionGroup) {
                            questionGroup.isQuestionGroupDirty = false;
                        }
                        USAA.ent.digitalData.component.attributes = {};
                    }
                }
            }
        },
        /**
         * set the original value in input
         * this should only be used on text field or text area.
         */
        inputFocusEvent: function(e) {
            if (this.data.isDisabled || this.data.isHidden) {
                return;
            } else {
                e.target.originalValue = e.target.get('value');
            }
        },
        /**
         * compare the original value to current value
         * if values are different, fire logSiteCatEvent
         * this should only be used on text field or text area.
         */
        inputBlurEvent: function(e) {
            var input;
            if (this.data.isDisabled || this.data.isHidden) {
                e.preventDefault();
                e.stopPropagation();
                return;
            } else {
                if (e.target.originalValue !== e.target.get('value')) {
                    input = e.target.getData('data');
                    if (input) {
                        input.question.questionGroup.isQuestionGroupDirty = true;
                    }
                    e.target.fire('logSiteCat');
                    e.eventStr = this.event.eventParams.eventStr;
                    mapTempValueToInputObj(e);
                    e.target.fire('updateObjectValue');
                }
                if (this.event.eventParams && this.event.eventParams.conditions) {
                    this.event.eventParams.conditions.forEach(function(condition) {
                        var node = Y.one('#' + condition.markupId);

                        if (node && condition.eventArr) {
                            condition.eventArr.forEach(function(event) {
                                node.fire(event);
                            });
                        }
                    });
                }
            }
        },
        /**
         * this is where the on change event will call. It will try to set the temp value into the input object
         */
        inputChangeEvent: function(e) {
            if (this.data.isDisabled || this.data.isHidden) {
                e.preventDefault();
                e.stopPropagation();
                return;
            } else {
                e.eventStr = this.event.eventParams.eventStr;
                mapTempValueToInputObj(e);
            }
        },
        /**
         * After the temp value is mapped to the value, it will invoke this validation event
         */
        inputChangeValidationEvent: function(e) {
            var node = e.target;
            var data = node.getData ? node.getData('data') : node.data;
            var questionGroup;
            var otherNode;

            if (data.input) {
                questionGroup = data.input.question.questionGroup;
            } else {
                questionGroup = data.question.questionGroup;
            }
            questionGroup.isQuestionGroupDirty = true;
            validateInput.call(this, e);
            if (this.event.eventParams.otherNodeValidation) {
                otherNode = Y.one(this.event.eventParams.otherNodeValidation.cssSelector);
                if (otherNode && this.event.eventParams.otherNodeValidation.eventArr && this.event.eventParams.otherNodeValidation.eventArr.constructor === Array) {
                    this.event.eventParams.otherNodeValidation.eventArr.forEach(function(event) {
                        otherNode.fire(event,{target:otherNode});
                    });
                }
            }
        },
        /**
         * this events will be fired when the validation is completed.
         */
        validationCompleted: function(e) {
            var node = e.target;
            var data = node.getData ? node.getData('data') : node.data;
            var input;

            if (data.input) {
                input = data.input;
            } else {
                input = data;
            }

            if (input.inputName) {
                if (input.isValidated) {
                    if (!questionVO[input.inputName]) {
                        input.question.questionGroup.numberOfAnsweredQuestion++;
                    }
                    questionVO[input.inputName] = input.value;
                } else {
                    if (questionVO[input.inputName]) {
                        input.question.questionGroup.numberOfAnsweredQuestion--;
                    }
                    delete questionVO[input.inputName];
                }
            }
            Y.fire('showNode');
            Y.fire('showNodeWithoutAnim');
            Y.fire('showQuestionWhenAllQuestionsAnswered');
            Y.fire('enableComponent');
            Y.fire('updateAttribute');
            input.question.questionGroup.container.fire('validateQuestionGroup', input.question.questionGroup);
        },
        /**
         * this will unpause the validation process
         */
        continueValidationCompleted: function(e) {
            var input, option, parentInput;

            if (!e) {
                return;
            }

            if (e.input) {
                input = e.input;
            } else {
                input = e;
            }

            option = input.question.questionGroup.modalOpenLink.getData('data');

            if (option.input) {
                parentInput = option.input;
            } else {
                parentInput = option;
            }

            if (parentInput) {
                parentInput.container.fire('validationCompleted', {target: parentInput.container});
            }
        },
        /**
         * this will clear the input for frontend and backend.
         */
        clearInput: function(e) {
            var input;

            if (!e || !e.input) {
                return;
            }

            input = e.input;

            if (input.input) {
                input = input.input;
            }

            Y.fire('clearInputBackend', {input: input});
            Y.fire('clearInputFrontend', {input: input});
        },
        /**
         * this function will be used to clear the modalPanel open link input
         */
        clearModalLinkInput: function(e) {
            var input, option;

            if (!e) {
                return;
            }

            if (e.input) {
                input = e.input;
            } else {
                input = e;
            }

            option = input.question.questionGroup.modalOpenLink.getData('data');

            if (option.input) {
                input = option.input;
            } else {
                input = option;
            }

            events.clearInput({input: input});
        },
        /**
         * this event will validate all the question group and it will forward user to the next unfinished questiongroup.
         */
        validateQuestionGroup: function(questionGroup, isAppStarted) {
            var hadFoundQuestionGroupPending = false;
            var areAllQuestionGroupsValidated = true;
            var lastValidatableQuestionGroup;
            var eventParams = {};
            if (this || this.event || this.event.eventParams) {
                eventParams = this.event.eventParams;
            }
            questionGroup.questionGroupArr.some(function(questionGroup, index, array) {
                if (questionGroup.isValidatable) {
                    lastValidatableQuestionGroup = questionGroup;
                    if (questionGroup.groupType === 'ExpandCollapseGroup') {
                        if ((questionGroup.totalNumberOfQuestions === questionGroup.numberOfAnsweredQuestion && !hadFoundQuestionGroupPending) || (questionGroup.isCreditPulled && questionGroup.completeGroupWhenCreditPulled)) {
                            areAllQuestionGroupsValidated = true;
                            if (questionGroup.ecLink) {
                                questionGroup.ecLink.removeClass('disable');
                                questionGroup.ecLink.addClass('complete');
                            }
                            if (questionGroup.hiddenStatus) {
                                questionGroup.hiddenStatus.set('innerHTML', 'Completed');
                            }
                            if (isAppStarted) {
                                questionGroup.isQuestionGroupDirty = false;
                            }
                            if (!isAppStarted && questionGroup.isQuestionGroupDirty && !eventParams.preventLogSiteCatQuestion) {
                                questionGroup.container.fire('logSiteCatQuestion');
                            }
                            questionGroup.isDisabled = false;
                        } else {
                            areAllQuestionGroupsValidated = false;
                            if (!hadFoundQuestionGroupPending) {
                                hadFoundQuestionGroupPending = true;
                                if (questionGroup.ecLink) {
                                    questionGroup.ecLink.removeClass('disable');
                                    questionGroup.ecLink.removeClass('complete');
                                }
                                if (questionGroup.hiddenStatus) {
                                    questionGroup.hiddenStatus.set('innerHTML', 'In Progress');
                                }
                                questionGroup.isDisabled = false;
                                setTimeout(function() {
                                    if (!questionGroup.isExpanded) {
                                        Y.fire('showNodeAnim', {node:questionGroup.ecContainer,showNode:true});
                                        Y.fire('scrollToNode', questionGroup);
                                        questionGroup.container.fire('logSiteCatPage');
                                        setTimeout(function() {
                                            if (questionGroup.ecLink) {
                                                questionGroup.ecLink.focus();
                                            }
                                        }, 500);
                                    }
                                }, 500);
                            } else {
                                if (questionGroup.ecLink) {
                                    questionGroup.ecLink.removeClass('complete');
                                    questionGroup.ecLink.addClass('disable');
                                }
                                if (questionGroup.hiddenStatus) {
                                    questionGroup.hiddenStatus.set('innerHTML', 'Pending');
                                }
                                questionGroup.isDisabled = true;
                                if (questionGroup.ecContainer) {
                                    Y.fire('showNodeAnim', {node:questionGroup.ecContainer,showNode:false});
                                }
                            }
                        }
                    }
                }
            });
            if (!hadFoundQuestionGroupPending && !lastValidatableQuestionGroup.isExpanded) {
                events.scrollAndExpandNode.call({event:{eventParams:{cssSelector:'#' + lastValidatableQuestionGroup.container.get('id')}}});
            }
            Y.fire('allQuestionsGroupValidated', areAllQuestionGroupsValidated);
        },
        /**
         * retrieve the Y position of the node
         */
        getYPosition: function(node) {
            var nodeYPosition;
            if (node) {
                nodeYPosition = 0;

                do {
                    nodeYPosition += node.get('offsetTop');
                } while (node = node.get('offsetParent'));
            }

            return nodeYPosition;
        },
        /**
         * this will fire the scroll animation to that specific node
         */
        scrollToNode: function(e) {
            var nodeYPosition, currentYPosition, scrollAnim;

            if (!e || !e.container) {
                return;
            }

            currentYPosition = document.body.scrollTop;
            nodeYPosition = events.getYPosition(e.container);

            if (nodeYPosition && nodeYPosition - currentYPosition !== 0) {
                scrollAnim = new Y.Anim({
                    duration: 0.5,
                    node: 'win',
                    easing: Y.Easing.easeOut,
                    to: {
                        scroll: [0, nodeYPosition]
                    }
                });

                scrollAnim.on('start', function() {
                    e.container.fire('scrollAnimationStarted', e);
                });

                scrollAnim.on('end', function() {
                    e.container.fire('scrollAnimationEnded', e);
                });

                scrollAnim.run();
            }
        },
        replaceInnerHTMLInNodes: function(e) {
            var value, data, input, replaceInnerHTMLParams;

            function getInputValue(input) {
                var tempValue;
                /*Grabbing the value from label*/
                if (!input) {
                    return undefined;
                }
                switch (true) {
                    case input.inputType.indexOf('RADIO') >= 0:
                    case input.inputType.indexOf('CHECKBOX') >= 0:
                        input.container.all('input').some(function(inputNode, index, array) {
                            if (inputNode.get('checked')) {
                                /*get the label text*/
                                tempValue = inputNode.next().get('innerHTML');
                                return true;
                            }
                        });
                        return tempValue;
                    case input.inputType.indexOf('DROPDOWN') >= 0:
                        return input.container.get('options').item(input.container.get('selectedIndex')).get('value');
                    case input.inputType.indexOf('TEXT') >= 0:
                        return input.container.get('value');
                }
            }

            data = e.target.getData('data');

            if (data.input) {
                input = data.input;
            } else {
                input = data;
            }
            replaceInnerHTMLParams = this.event;
            if(!replaceInnerHTMLParams.eventParams.value){
                value = getInputValue(input);
            }else{
                value = replaceInnerHTMLParams.eventParams.value;
            }

            if (replaceInnerHTMLParams && replaceInnerHTMLParams.eventParams) {
                if (replaceInnerHTMLParams.eventParams.condition) {
                    if (replaceInnerHTMLParams.eventParams.condition.operation === 'addition') {
                        if (replaceInnerHTMLParams.eventParams.condition.otherCssSelector) {
                            replaceInnerHTMLParams.eventParams.condition.otherCssSelector.forEach(function(cssSelector, index, array) {
                                var tempNode = Y.one(cssSelector);
                                var tempValue;
                                if (tempNode) {
                                    value = Number(value) ? Number(value) : 0;
                                    tempValue = Number(getInputValue(tempNode.getData('data')));
                                    value += tempValue ? tempValue : 0;
                                }
                            });
                        }
                    }
                }

                if (replaceInnerHTMLParams.eventParams.cssSelector) {
                    replaceInnerHTMLObj[replaceInnerHTMLParams.eventParams.cssSelector] = value;
                    Y.all(replaceInnerHTMLParams.eventParams.cssSelector).each(function(node, index, array) {
                        node.set('innerHTML', value);
                    });
                }
            }
        },
        /**
         * provide a way to remove value from questionVO
         * @param string key that you want to remove from questionVO
         */
        deleteFromQuestionVO: function(e) {
            if (!e || typeof e !== 'string') {
                return;
            }

            delete questionVO[e];
        },
        /**
         * provide a way to add value to questionVO
         * @param {Object} need to have attribute key and value
         */
        addToQuestionVO: function(e) {
            if (!e || typeof e.key !== 'string' || typeof e.value !== 'string') {
                return;
            }

            questionVO[e.key] = e.value;
        },
        /**
         * Send questionVO back to server for processing and persisting purpose
         */
        recordLoan: function(e) {
            Y.fire('pq-app-start');
            Y.io(dataObject.preQualRecordLoanCallBack + '&ts=' + new Date().getTime(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: convertJsonToFormData(questionVO),
                on: {
                    success: function(transactionId, response) {
                        var obj;
                        try {
                            obj = Y.JSON.parse(response.responseText);
                            if (obj.loanNumber) {
                                Y.fire('logLoanNumberSiteCat', obj.loanNumber);
                            }
                            if (obj.redirectUrl) {
                                events.redirectToUrl(obj.redirectUrl);
                            }
                        } catch (e) {

                        }
                        return;
                    },
                    failure: function(transactionId, response) {
                        return;
                    }
                }
            });
        },
        /**
         * Perform get operation to retrieve cities for a specific states
         * Retrieved cities will be stored in dataObject for caching purpose
         */
        retrieveCities: function(e) {
            var node = e.target;
            var data = node.getData('data');

            var value = retrieveValue(data);

            if (!dataObject.citiesStatesMap[value]) {
                Y.io(dataObject.preQualPageCallbackUrl + '&purpose=retrieveCitiesByState&state=' + value + '&ts=' + new Date().getTime(), {
                    on: {
                        success: function(transactionId, response) {
                            var cities;

                            try {
                                cities = Y.JSON.parse(response.responseText);

                                if (cities.redirectUrl) {
                                    events.redirectToUrl(cities.redirectUrl);
                                } else {
                                    dataObject.citiesStatesMap[value] = cities;
                                    Y.fire('updateCitiesAutoCompleteList', {value: value, isPreLoaded: e.isPreLoaded});
                                }
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                        },
                        failure: function(transactionId, response) {
                            console.error(response);
                            /*do nothing*/
                        }
                    }
                });
            } else {
                Y.fire('updateCitiesAutoCompleteList', {value: value, isPreLoaded: e.isPreloaded});
            }
        },
        /**
         * set the cities into the auto-complete text-field
         */
        updateCitiesAutoCompleteList: function(e) {
            var cities;
            var container;

            if (!e || !e.value) {
                return;
            }

            if (this.isOptionContainer) {
                container = this.data.optionContainer;
            } else {
                container = this.data.container;
            }

            if (!e.isPreLoaded) {
                events.clearInput({input: this.data});
            }
            Y.fire('showQuestionWhenAllQuestionsAnswered');
            if (this.data.question.feedbackPanel && !this.data.question.feedbackPanel.hasClass('usaa-hidden')) {
                Y.fire('showNodeAnim', {node:this.data.question.feedbackPanel,showNode:false});
            }

            if (dataObject.citiesStatesMap[e.value]) {
                /*retrieve a sorted array of cities*/
                if (dataObject.citiesStatesMap[e.value].constructor === Array) {
                    cities = dataObject.citiesStatesMap[e.value].sort();
                } else {
                    cities = retrieveObjectKeysArray(dataObject.citiesStatesMap[e.value]);
                }

                /*set cities array into the autocomplete list*/
                if (cities && cities.constructor === Array) {
                    container.ac.set('source', cities);
                    container.setData('wordMatchArr', cities.map(function(city){return city.toUpperCase();}));
                }
            }
        },
        /**
         * this will enable the component base on the event condition or event params.
         */
        enableComponent: function(e) {
            var event = this.event;
            var enableNode = checkEventParams.call(this, event.eventParams);
            var data = this.data;

            if (data.realEstateUIOptionVOList && data.inputType.indexOf('DROPDOWN') < 0) {
                if (enableNode) {
                    data.realEstateUIOptionVOList.forEach(function(option, index, array) {
                        option.isDisabled = false;
                        option.container.removeAttribute('disabled');
                        if (option.hiddenStatus) {
                            option.hiddenStatus.set('innerHTML', '');
                        }
                    });
                } else {
                    data.realEstateUIOptionVOList.forEach(function(option, index, array) {
                        option.isDisabled = true;
                        option.container.setAttribute('disabled', 'disabled');
                        if (option.hiddenStatus) {
                            option.hiddenStatus.set('innerHTML', 'Disabled');
                        }
                    });
                }
            } else {
                if (enableNode) {
                    data.isDisabled = false;
                    data.container.removeAttribute('disabled');
                    if (data.hiddenStatus) {
                        data.hiddenStatus.set('innerHTML', '');
                    }
                } else {
                    data.isDisabled = true;
                    data.container.setAttribute('disabled', 'disabled');
                    if (data.hiddenStatus) {
                        data.hiddenStatus.set('innerHTML', 'Disabled');
                    }
                }
            }
        },
        enableComponentUponAllQuestionGroupsValidated: function(areAllValidated) {
            if (areAllValidated === undefined || !this || !this.data || !this.data.container) {
                return;
            }
            if (areAllValidated) {
                this.data.isDisabled = false;
                this.data.container.removeAttribute('disabled');
            } else {
                this.data.isDisabled = true;
                this.data.container.setAttribute('disabled', 'disabled');
            }
        },
        /**
         * prevent user from entering more than a specify character length
         */
        textFieldMaxLength: function(e) {
            var event = this.event;
            var value = retrieveValue(e.target.getData('data'));

            if (event.eventParams && event.eventParams.maxLength) {
                /*the following keyCode allow user to use backspace, tab, enter and delete in firefox*/
                if (e.which === 8 || e.which === 9 || e.which === 13) {
                    return;
                } else if (value.length === event.eventParams.maxLength) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        },
        /**
         * prevent user from entering characters that is not specify in the params
         * @param e {Object}
         */
        textFieldAllowableCharacters: function(e) {
            var event = this.event;

            if (!e.target.allowableChars) {
                e.target.allowableChars = event.eventParams.allowableChars.map(function(charLetter) {
                    return charLetter.charCodeAt(0);
                });
            }

            /*this is for firefox keypress fixed where it captured all the functional key stroke from user.*/
            if (e.which === 8 || e.which === 9 || e.which === 13) {
                return;
            } else if (e.target.allowableChars.indexOf(e.which) < 0 || e.shiftKey !== event.eventParams.shiftKey || e.ctrlKey !== event.eventParams.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        submitCredit: function(e) {
            if (this.data.isDisabled || this.data.isHidden) {
                e.preventDefault();
                e.stopPropagation();
                return;
            } else {
                questionVO.isCreditRequestSubmitted = "true";
                Y.fire('enableComponent');

                /*send request to usaa to submit credit*/
                Y.io(dataObject.preQualSubmitCreditCallBack + '&ts=' + new Date().getTime(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: convertJsonToFormData(questionVO),
                    on: {
                        success: function(transactionId, response) {
                            var obj;

                            try {
                                obj = Y.JSON.parse(response.responseText);
                            } catch (e) {

                            }

                            if (obj && obj.redirectUrl) {
                                events.redirectToUrl(obj.redirectUrl);
                            } else {
                                Object.defineProperty(dataObject, 'isCreditSubmitted', {
                                    enumerable:true,
                                    configuration:false,
                                    writable:false,
                                    value:true
                                });
                                Y.fire('creditHasSubmittedSuccessfully');
                            }
                        },
                        failure: function(transactionId, response) {
                            console.error(response);
                            return;
                        }
                    }
                });
            }
        },
        submitDU: function(e) {
            if (this.data.isDisabled || this.data.isHidden) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                dataObject.isDUSubmitted = false;
                Y.io(dataObject.preQualSubmitDUCallBack + '&ts=' + new Date().getTime(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: convertJsonToFormData(questionVO),
                    on: {
                        success: function(transactionId, response) {
                            var obj;

                            try {
                                obj = Y.JSON.parse(response.responseText);
                            } catch (e) {

                            }

                            if (obj && obj.redirectUrl) {
                                events.redirectToUrl(obj.redirectUrl);
                            } else {
                                dataObject.isDUSubmitted = true;
                                isDUResponseReceived = false;
                                Y.fire('duResponseSuccess');
                            }
                        },
                        failure: function(transactionId, response) {
                            Y.fire('duResponseFail');
                        }
                    }
                });
            }
        },
        softDecline: function(e) {
            if (dataObject.preQualPageCallback && typeof dataObject.preQualPageCallback === 'function') {
                dataObject.preQualPageCallback('noThanks');
            }
            /*Y.io(dataObject.preQualPageCallbackUrl + '&purpose=noThanks&ts=' + new Date().getTime(), {
             on: {
             success: function(transactionId, response) {
             var obj;

             try {
             obj = Y.JSON.parse(response.responseText);

             if (obj.redirectUrl) {
             events.redirectToUrl(obj.redirectUrl);
             }
             } catch (e) {

             }
             },
             failure: function(transactionId, response) {

             }
             }
             });*/
        },
        recordLiability: function(e) {
            if (!e || !e.liability) {
                return;
            }

            Y.io(dataObject.preQualRecordLiabilitiesCallBack + '&ts=' + new Date().getTime(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: convertJsonToFormData(e.liability),
                on: {
                    success: function(transactionId, response) {
                        var obj;

                        try {
                            obj = Y.JSON.parse(response.responseText);

                            if (obj.redirectUrl) {
                                events.redirectToUrl(obj.redirectUrl);
                            }
                        } catch (e) {

                        }

                        return;
                    },
                    failure: function(transactionId, response) {
                        return;
                    }
                }
            });
        },
        startInterstitialPanel: function(e) {
            if (this.data.isDisabled || this.data.isHidden) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                Y.fire('startInterstitialPanel', this.event.eventParams);
            }
        },
        /**
         * update the slider length as the question group first expanded.
         * if length is 'auto' or undefined. Prevent updating the slider length
         */
        updateSliderLength: function(e) {
            var node, length;
            if (!this || !this.data || !this.event) {
                return;
            }

            /*retrieve length for slider*/
            node = this.data.container.one(this.event.eventParams.cssSelector);
            if (node) {
                /*retrieve width in string*/
                length = node.getComputedStyle('width');
            }

            if (this.data.realEstateUIQuestionVOList && length && length !== 'auto') {
                this.data.realEstateUIQuestionVOList.forEach(function(question) {
                    var slider;

                    if (question.questionType === 'SLIDER') {
                        slider = question.realEstateUISliderVO.container.getData('slider');

                        if (slider &&  length !== slider.get('length')) {
                            slider.set('length', length);
                        }
                    }
                });
            }
        },
        /**
         * Signify the slide start event is started by the user.
         * then call sliderValueChangeFunction.
         */
        slideStartEvent: function(e) {

            if (!this || !this.data || !this.event) {
                return;
            }

            this.data.slider.slideStartedByUser = true;
            events.sliderValueChange.call(this, e);
        },
        sliderValueChange: function(e) {
            var data;

            if (!this || !this.data || !this.event) {
                return;
            }

            data = this.data;

            if (this.data.labelContainer) {
                this.data.labelContainer.set('innerHTML', this.data.label.format(e.newVal));
            }

            if (this.event.eventParams && this.event.eventParams.conditions && data.slider.slideStartedByUser) {
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);
                    var e = {data: data, newValue: data.slider.get('value')};

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, e);
                        });
                    }
                });
            }
        },
        /**
         * this will update the value of the related textfields as user slide the slider.
         * this event should be attached to the textfield not to the slider itself
         * @param e {Object} this should have a newValue child element within this object
         */
        updateSliderInput: function(e) {
            var newValue;
            if (!this || !this.data || !this.event || !e) {
                return;
            }

            if (this.data.container) {
                if (this.event.eventParams && this.event.eventParams.valueFormatFunction && this.event.eventParams.valueFormatFunctionLocation) {
                    newValue = retrieveFunctionLocation(this.event.eventParams.valueFormatFunctionLocation)[this.event.eventParams.valueFormatFunction](this.data.container);
                } else {
                    newValue = e.newValue;
                }

                if (typeof newValue === 'number') {
                    this.data.container.set('value', newValue.toString());
                    dataObject[this.data.inputName] = Number(newValue);
                } else {
                    this.data.container.set('value', '');
                    dataObject[this.data.inputName] = 0;
                }
            }

            this.data.container.fire('inputUpdateEvent', {target: this.data.container});

            if (this.event.eventParams && this.event.eventParams.conditions) {
                var param = {data: this.data, newValue: dataObject[this.data.inputName]};
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, param);
                        });
                    }
                });
            }
        },
        sliderInputValueChange: function(e) {
            var data, param;

            if (!this || !this.data || !this.event) {
                return;
            }

            data = this.data;
            this.data.container.disableSetMinimumValue = true;

            if (this.event.eventParams && this.event.eventParams.conditions) {
                param = {data: data, newValue: data.container.get('value') ? Number(data.container.get('value')) : ''};
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, param);
                        });
                    }
                });
            }
        },
        sliderInputBlurEvent: function(e) {
            var input;
            if (this.data.isDisabled || this.data.isHidden) {
                e.preventDefault();
                e.stopPropagation();
                return;
            } else {
                if (e.target.originalValue !== e.target.get('value')) {
                    input = e.target.getData('data');
                    if (input) {
                        input.question.questionGroup.isQuestionGroupDirty = true;
                    }
                    e.target.fire('logSiteCat');
                }
                if (this.event.eventParams && this.event.eventParams.conditions) {
                    this.event.eventParams.conditions.forEach(function(condition) {
                        var node = Y.one('#' + condition.markupId);

                        if (node && condition.eventArr) {
                            condition.eventArr.forEach(function(event) {
                                node.fire(event);
                            });
                        }
                    });
                }
            }
        },
        /**
         * this will update the value of the related slider as user change the value in an input
         * this event should be attached to the slider not to the input field itself
         * @param e {Object} this should have a newValue child element within this object
         */
        updateSliderValue: function(e) {
            if (!this || !this.data || !this.event || !e) {
                return;
            }

            if (this.data.slider && (typeof e.newValue === 'number' || typeof e.newValue === 'string') && this.data.slider.get('value') !== e.newValue) {
                this.data.slider.set('value', Number(e.newValue));
                dataObject[this.data.inputName] = Number(e.newValue);
            }

            if (this.event.eventParams && this.event.eventParams.conditions) {
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, e);
                        });
                    }
                });
            }
        },
        /**
         * this will mainly be used for updating loan amount.
         */
        updateLabel: function(e) {
            var newValue;
            if (!this || !this.data || !this.event || !e) {
                return;
            }

            if (this.data.container) {
                if (this.event.eventParams && this.event.eventParams.valueFormatFunction && this.event.eventParams.valueFormatFunctionLocation) {
                    newValue = retrieveFunctionLocation(this.event.eventParams.valueFormatFunctionLocation)[this.event.eventParams.valueFormatFunction](this.data.container);
                } else {
                    newValue = e.newValue;
                }
                this.data.container.set('innerHTML', newValue);
            }

            if (this.event.eventParams && this.event.eventParams.conditions) {
                var param = {data: this.data, newValue: this.data.container.value};
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, param);
                        });
                    }
                });
            }
        },
        allowSetMinimumValue: function(e) {
            this.data.container.disableSetMinimumValue = false;
        },
        /**
         * set the minimum value of the textfield if nothing is available. Use only for slider related textfield
         */
        setMinimumValue: function(e) {
            var param;
            if (!this || !this.data || !this.event || !e) {
                return;
            }

            if (this.data.container && !this.data.container.get('value') && !this.data.container.disableSetMinimumValue) {
                this.data.container.set('value', this.data.container.get('min'));
                dataObject[this.data.inputName] = Number(this.data.container.get('min'));
                this.data.container.fire('logSiteCat');
            }

            if (this.event.eventParams && this.event.eventParams.conditions) {
                param = {data: this.data, newValue: Number(this.data.container.get('value'))};
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, param);
                        });
                    }
                });
            }
        },
        /**
         * This function is used to update the attributes on html element
         * Mainly being used to update the minimum amount on downpayment
         */
        updateAttribute: function(e) {
            var input, data;

            if (!this || !this.data || !this.event || !this.event.eventParams || this.event.eventParams.constructor !== Array) {
                return;
            }

            data = this.data;

            if (this.data.slider) {
                input = this.data.slider;
            } else {
                input = this.data.container;
            }

            this.event.eventParams.some(function(param, index, array) {
                var conditionMatched = checkEventParams.call(data, param.rule);

                if (conditionMatched) {
                    input.set(param.attr, param.value);
                    if (input.data && input.data[param.attr] !== undefined) {
                        input.data[param.attr] = param.value;
                    }
                    Object.defineProperty(replaceInnerHTMLObj, param.cssSelector, {
                        enumerable: true,
                        configuration: true,
                        writable: true,
                        value: param.value
                    });
                    Y.all(param.cssSelector).each(function(node, index, array) {
                        node.set('innerHTML', param.value);
                    });
                    return true;
                }
            });
        },
        openSingleLiabilityModalPanel: function(e) {
            var modalNode;
            if (questionVO.currentAddressOwnership === '1') {
                modalNode = Y.one('#single-liability-modal .modal-containers');
            } else {
                modalNode = Y.one('#adjust-downpayment-purchase-price-modal .modal-containers');
            }

            if (modalNode) {
                Y.EventDirector_js.sendCommand('ModalPanel/open',{modalId:modalNode.get('id')});
            }
        },
        openLiabilitiesModalPanel: function(e) {
            var modalNode;

            if (liabilities && liabilities.length > 1) {
                modalNode = Y.one('#multiple-liabilities-modal .modal-containers');
            } else {
                modalNode = Y.one('#adjust-downpayment-purchase-price-modal .modal-containers');
            }

            if (modalNode) {
                Y.EventDirector_js.sendCommand('ModalPanel/open',{modalId:modalNode.get('id')});
            }
        },
        /**
         * InterstitialCountdownCompleted Event
         */
        interstitialCountDownCompletedEvent: function(e) {
            var modalPanel;
            if (!activeInterstitialPanel || !interstitialPanels[activeInterstitialPanel]) {
                return;
            }

            if (this.event.eventParams) {
                if (this.event.eventParams.closeInterstitialPanel) {
                    /*close intertitial Panel*/
                    Y.fire('endInterstitialPanel',{markupId:activeInterstitialPanel});
                }

                /*stop "check du available" interval*/
                if (this.event.eventParams.markDUResponseReceived) {
                    isDUResponseReceived = true;
                }
                if (this.event.eventParams.modalPanelCssSelector) {
                    modalPanel = Y.one(this.event.eventParams.modalPanelCssSelector + ' .modal-containers');
                    if (modalPanel) {
                        Y.EventDirector_js.sendCommand('ModalPanel/open', {modalId:modalPanel.get('id')});
                    }
                }
                if (this.event.eventParams.redirectPage) {
                    if (dataObject.preQualPageCallback && typeof dataObject.preQualPageCallback === 'function') {
                        dataObject.preQualPageCallback(this.event.eventParams.redirectPage);
                    }
                }
            }
        },
        /**
         * When the slide is ended, set the flag to false so that system know that any slider value change events is not trigger by user
         */
        slideEndEvent: function(e) {
            if (!this || !this.data || !this.data.slider) {
                return;
            }

            /*delete this.data.slider.slideStartedByUser;*/
            this.data.container.fire('logSiteCat');

            if (this.event.eventParams && this.event.eventParams.conditions) {
                var param = {data: this.data, newValue: this.data.container.value};
                this.event.eventParams.conditions.forEach(function(condition) {
                    var node = Y.one('#' + condition.markupId);

                    if (node && condition.eventArr) {
                        condition.eventArr.forEach(function(event) {
                            node.fire(event, param);
                        });
                    }
                });
            }
        },
        storeRecordLoanRequest: function() {
            Y.io(dataObject.preQualPageCallbackUrl + '&purpose=modifyLoan&ts=' + new Date().getTime(), {
                on: {
                    success: function(transactionId, response) {
                        var obj;
                        try {
                            obj = Y.JSON.parse(response.responseText);

                            if (obj.redirectUrl) {
                                events.redirectToUrl(obj.redirectUrl);
                            }
                        } catch (e) {

                        }
                    },
                    failure: function(transactionId, response) {
                        /*do nothing*/
                    }
                }
            });
        },
        redirectToResultPage: function() {
            if (dataObject.preQualPageCallback && typeof dataObject.preQualPageCallback === 'function') {
                dataObject.preQualPageCallback('redirectToResultPage');
            }
        },
        redirectToUrl: function(url) {
            if (url) {
                if (dataObject.preQualPageCallback && typeof dataObject.preQualPageCallback === 'function') {
                    dataObject.preQualPageCallback(url);
                }
            }
        },
        setDataObject: function(key, value) {
            if (typeof key !== 'string' || value === undefined) {
                return;
            }

            Object.defineProperty(dataObject, key, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: value
            });
        },
        setDataObjectValue: function(key, value) {
            if (!key || !value) {
                return;
            }

            dataObject[key] = value;
        },
        getDataObject: function() {
            return dataObject;
        },
        getQuestionVO: function() {
            return questionVO;
        }
    };

    /**
     * this function will dynamically retrieve the json object base on the namespace string that is passed in
     * @param functionLocation aka namespace
     */
    function retrieveFunctionLocation(functionLocation) {
        var functionLocationArr, functionLocationObj = Y;
        if (!functionLocation && typeof functionLocation !== 'string') {
            return;
        }

        if (eventsLoc[functionLocation]) {
            return eventsLoc[functionLocation];
        } else {
            functionLocationArr = functionLocation.split('.');

            for (var i = 0; i < functionLocationArr.length; i++) {
                if (functionLocationObj[functionLocationArr[i]]) {
                    functionLocationObj = functionLocationObj[functionLocationArr[i]];
                } else {
                    return;
                }
            }
        }

        eventsLoc[functionLocation] = functionLocationObj;
        return functionLocationObj;
    }

    /**
     * This is a validation function
     * @param e
     */
    function validateInput(e) {
        var node = e.target;
        var data = node.getData ? node.getData('data') : node.data;
        var currentIndex;
        var questionGroup;
        var currentEvent = this.event;

        if (data.input) {
            currentIndex = data.input.question.index;
            questionGroup = data.input.question.questionGroup;
        } else {
            currentIndex = data.question.index;
            questionGroup = data.question.questionGroup;
        }

        /*looping through each question until it hit the current question.*/
        questionGroup.realEstateUIQuestionVOList.some(function(question, index, array) {
            var input = question.realEstateUIInputVO ? question.realEstateUIInputVO : question.realEstateUISliderVO ? question.realEstateUISliderVO : question.realEstateUIButtonVO ? question.realEstateUIButtonVO : undefined,
                eventObj, errorEventParam, hasError, errorMessageNode;
            var eventIdRegex;
            if (!question.isHidden) {
                if (input && input.realEstateUIEventVOMap) {
                    if (input.question.index === currentIndex) {
                        eventObj = currentEvent;
                    } else {
                        eventIdRegex = /-validation$/;
                        Object.keys(input.realEstateUIEventVOMap).some(function(key, index, array) {
                            if (key.match(eventIdRegex)) {
                                eventObj = input.realEstateUIEventVOMap[key];
                                return true;
                            }
                        });
                    }
                }
                hasError = false;

                if (eventObj && eventObj.eventParams && eventObj.eventParams.rule && eventObj.eventParams.rule.constructor === Array) {
                    eventObj.eventParams.rule.some(function(eventParam, index, array) {
                        var functionLocation = retrieveFunctionLocation(eventParam.validationFunctionLocation);
                        errorEventParam = eventParam;
                        if (functionLocation && functionLocation[eventParam.validationFunction]) {
                            hasError = functionLocation[eventParam.validationFunction](input, eventParam);

                            return hasError;
                        }
                    });

                    input.isValidated = !hasError;

                    if (hasError && errorEventParam.errorMessage) {
                        if (input.question.feedbackPanel) {
                            /*create errorMessageNode*/
                            errorMessageNode = Y.Node.create(errorEventParam.errorMessage);

                            Object.keys(replaceInnerHTMLObj).forEach(function(key, index, array) {
                                var innerHtmlObj = replaceInnerHTMLObj[key];

                                errorMessageNode.all(key).each(function(node, index, array) {
                                    node.set('innerHTML', innerHtmlObj);
                                });
                            });

                            if (input.question.feedbackPanel.errorNotice) {
                                /*clear any error messages in the feedbackPanel*/
                                input.question.feedbackPanel.errorNotice.set('innerHTML', '');
                                /*append the new error message to the feedbackPanel*/
                                input.question.feedbackPanel.errorNotice.append(errorMessageNode);
                            }

                            if (input.question.feedbackPanel.hasClass('usaa-hidden')) {
                                Y.fire('showNodeAnim', {node:input.question.feedbackPanel,showNode:true});
                            }
                        }
                    } else {
                        if (input.question.feedbackPanel && !input.question.feedbackPanel.hasClass('usaa-hidden')) {
                            Y.fire('showNodeAnim', {node:input.question.feedbackPanel,showNode:false});
                        }
                    }
                }
            }

            if (currentIndex === index && input) {
                if (!currentEvent.eventParams.isDelayValidation) {
                    input.container.fire('validationCompleted', e);
                }
                return true;
            }
        });
    }

    /**
     * this function will be used to retrieve the value from option or input VO
     */
    function retrieveValue(data, isRetrieveSiteCatValue) {
        var input, value = undefined;

        if (!data) {
            return undefined;
        }

        if (data.input) {
            input = data.input;
        } else {
            input = data;
        }

        /*retrieve value from input and assign to "value" variable.*/
        switch (true) {
            case input.slider !== undefined:
                value = input.slider.get('value').toString();
                break;
            case input.inputType && input.inputType.indexOf('RADIO') >= 0:
            case input.inputType && input.inputType.indexOf('CHECKBOX') >= 0:
                input.container.all('input').some(function(inputNode, index, array) {
                    if (inputNode.get('checked')) {
                        if (isRetrieveSiteCatValue) {
                            value = inputNode.getData('data').siteCatValue;
                            if (!value) {
                                value = inputNode.getData('data').value;
                            }
                        } else {
                            value = inputNode.getData('data').value;
                        }
                        return true;
                    }
                });
                break;
            /*case input.inputType.indexOf('CHECKBOX') >= 0:
             input.containers.all('input').some(function(inputNode, index, array) {
             if (inputNode.get('checked')) {
             if (isRetrieveSiteCatValue) {
             value = inputNode.getData('data').siteCatValue;
             if (!value) {
             value = inputNode.getData('data').value;
             }
             } else {
             value = inputNode.getData('data').value;
             }
             return true;
             }
             });
             break;*/
            case input.inputType && input.inputType.indexOf('DROPDOWN') >= 0:
                value = data.container.get('options').item(data.container.get('selectedIndex')).getData('data').value;
                break;
            case input.inputType && input.inputType.indexOf('TEXT') >= 0:
                value = data.container.get('value');
                break;
            default:
                break;
        }

        return value;
    }

    /**
     * this funciton will take an object and return a sorted key array back
     */
    function retrieveObjectKeysArray(obj) {
        var objKeyArr;

        if (obj) {
            objKeyArr = [];
            if (Object.keys) {
                return Object.keys(obj).sort();
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        objKeyArr.push(key);
                    }
                }

                return objKeyArr.sort();
            }
        }
    }

    /**
     * this is a function that will be called first on each input validation events
     * This will also trigger logging to site catalyst as well.
     */
    function mapTempValueToInputObj(e) {
        var node = e.target;
        var data = node.getData ? node.getData('data') : node.data;
        var input;

        if (data.input) {
            input = data.input;
        } else {
            input = data;
        }
        input.question.questionGroup.isQuestionGroupDirty = true;
        if (input.inputType) {
            switch (true) {
                case input.inputType.indexOf('RADIO') >= 0:
                case input.inputType.indexOf('CHECKBOX') >= 0:
                case input.inputType.indexOf('DROPDOWN') >= 0:
                    input.container.fire('logSiteCat');
                    break;
                default:
                    break;
            };
        }
        input.value = retrieveValue(data);
        dataObject[input.inputName] = input.value;
        input.container.sourceValue = input.value;
        input.container.fire(e.eventStr, e);
        input.container.fire('replaceInnerHTMLInNodes', e);
    }

    /**
     * This function will be used to clear the backend side of the input
     * For example: update number of question answered
     */
    function clearInputBackend(e) {
        var input;
        if (!e || !e.input) {
            return;
        }

        input = e.input;

        if (questionVO[input.inputName]) {
            input.question.questionGroup.numberOfAnsweredQuestion--;
        }

        input.value = undefined;
        input.isValidated = false;

        Y.fire('deleteFromQuestionVO', input.inputName);
    }

    /**
     * This function will be used to clear the frontend side of the input
     * For example: unchecked the radio button
     */
    function clearInputFrontend(e) {
        var input, logSiteCat = false;

        if (!e || !e.input) {
            return;
        }

        input = e.input;

        switch (true) {
            case input.inputType.indexOf('RADIO') >= 0:
            case input.inputType.indexOf('CHECKBOX') >= 0:
                input.realEstateUIOptionVOList.forEach(function(option, index, array) {
                    if (option.container.get('checked')) {
                        logSiteCat = true;
                    }
                    option.container.set('checked', false);
                });
                break;
            case input.inputType.indexOf('DROPDOWN') >= 0:
                if (input.container.get('selectedIndex')) {
                    logSiteCat = true;
                }
                input.container.set('selectedIndex', 0);
                break;
            case input.inputType.indexOf('TEXT') >= 0:
                if (input.container.get('value')) {
                    logSiteCat = true;
                }
                input.container.set('value', '');
                break;
        }

        if (logSiteCat) {
            input.container.fire('logSiteCat');
        }
    }

    /**
     * this function will run through the eventparams and check if the condition match the eventparams
     * This function should only be used in showNode and enableComponent
     * @param params
     */
    function checkEventParams(params) {
        var condition = true;
        var data = this;

        params.some(function(param, index, array) {
            var keys = Object.keys(param);
            var tempShowNode = true;

            keys.some(function(key, index, array) {
                var min, max, value;
                switch (param[key].condition) {
                    case 'EQUAL':
                        if (typeof questionVO[key] === 'object') {
                            if (!questionVO[key].equals(param[key].value)) {
                                tempShowNode = false;
                                return true;
                            } else {
                                break;
                            }
                        } else {
                            if (param[key].value !== questionVO[key]) {
                                tempShowNode = false;
                                return true;
                            } else {
                                break;
                            }
                        }
                    case 'not-equal':
                        if (typeof questionVO[key] === 'object') {
                            if (questionVO[key].equals(param[key].value)) {
                                tempShowNode = false;
                                return true;
                            } else {
                                break;
                            }
                        } else {
                            if (questionVO[key] === param[key].value) {
                                tempShowNode = false;
                                return true;
                            } else {
                                break;
                            }
                        }
                    case 'not-null':
                        if (!questionVO[key]) {
                            tempShowNode = false;
                            return true;
                        } else {
                            break;
                        }
                    case 'is-null':
                        if (questionVO[key]) {
                            tempShowNode = false;
                            return true;
                        } else {
                            break;
                        }
                    case 'not-in-range':
                        if (questionVO[key]) {
                            min = Number(data.data.container.getAttribute('min'));
                            max = Number(data.data.container.getAttribute('max'));
                            value = Number(questionVO[key]);

                            if (typeof value === 'number') {
                                if (typeof min === 'number' && typeof max === 'number') {
                                    if (value >= min && value <= max) {
                                        tempShowNode = false;
                                        return true;
                                    }
                                } else if (typeof max === 'number' && typeof min !== 'number') {
                                    if (value <= max) {
                                        tempShowNode = false;
                                        return true;
                                    }
                                } else if (typeof min === 'number' && typeof max !== 'number') {
                                    if (value >= min) {
                                        tempShowNode = false;
                                        return true;
                                    }
                                }
                            }
                            break;
                        } else {
                            tempShowNode = false;
                            return true;
                            break;
                        }
                    case 'greater-than':
                        value = Number(questionVO[key]) ? Number(questionVO[key]) : Number(dataObject[key]);

                        max = Number(questionVO[param[key].fieldName]) ? Number(questionVO[param[key].fieldName]) : Number(dataObject[param[key].fieldName]);

                        if (isNaN(value)) {
                            value = 0;
                        }
                        if (isNaN(max)) {
                            max = 0;
                        }

                        if (value <= max) {
                            tempShowNode = false;
                            return true;
                        }
                        break;
                }
            });

            condition = tempShowNode;

            if (tempShowNode) {
                return true;
            }
        });

        return condition;
    }
    /**
     * converted a passed in json object to a valid formData for post operation
     */
    function convertJsonToFormData(json) {
        var formData;
        var formDataStr;

        if (json) {
            formData = [];

            /*append CSRF token to the formData*/
            formData.push(encodeURIComponent(dataObject.tokenName) + '=' + encodeURIComponent(dataObject.token));
            /*turn the data object into an array of URL encoded key value pairs*/
            formData.push(encodeURIComponent('jsonStr') + '=' + encodeURIComponent(JSON.stringify(json)));

            /*combine the pairs into a single string and replace all encoded spaces to the plus
             character to match the behavior of the web browser form submit.*/
            formDataStr = formData.join('&').replace(/%20/g, '+');

            return formDataStr;
        }
    }

    function logPage(){
        if(currentPage === undefined || currentPage !== this.event.eventParams.page.pageDesc){
            if (USAA && USAA.ent) {
                if (USAA.ent.digitalData && USAA.ent.digitalData.page) {
                    Y.mix(USAA.ent.digitalData.page, this.event.eventParams.page, true);
                }
                if (USAA.ent.DigitalAnalytics && USAA.ent.DigitalAnalytics.pageView) {
                    USAA.ent.DigitalAnalytics.pageView();
                }
            }
            currentPage = this.event.eventParams.page.pageDesc;
        }
    }

    /**
     * this function will be mainly used in handling modal panel accessibility.
     * It will return boolean true to signify if the node is disabled or its parent node is hidden.
     */
    function checkCurrentElementIsDisabledorParentIsHidden(node) {
        if (node) {
            if (node.hasAttribute('disabled')) {
                return true;
            }

            if (node.tabIndex < 0) {
                return true;
            }

            if (Y.Node(node).ancestor('.usaa-hidden')) {
                return true;
            }
        }

        return false;
    }

    function enableFocusManager(e) {
        var focusableElements, currentFocusIndex = 0, i;

        focusableElements = e.node.querySelectorAll('button, input, select, a, [tabindex]');

        focusableElements.item(currentFocusIndex).focus();

        document.body.onkeydown = function(e) {
            e = (e) ? e : window.event;
            var keyCode = e.which ? e.which : e.keyCode;
            if (keyCode === 9 || (e.shiftKey && keyCode === 9)) {

                e.preventDefault ? e.preventDefault() : e.returnValue = false;

                if ((document.activeElement && document.activeElement.className.indexOf('modal-active') > -1) || document.activeElement === document.body) {
                    currentFocusIndex = 0;
                } else if (e.shiftKey && currentFocusIndex > 0) {
                    for (i = currentFocusIndex - 1; i >= 0; i--) {
                        if (!checkCurrentElementIsDisabledorParentIsHidden(focusableElements.item(i))) {
                            currentFocusIndex = i;
                            break;
                        }
                    }
                } else if (!e.shiftKey && currentFocusIndex < focusableElements.length - 1){
                    for (i = currentFocusIndex + 1; i < focusableElements.length; i++) {
                        if (!checkCurrentElementIsDisabledorParentIsHidden(focusableElements.item(i))) {
                            currentFocusIndex = i;
                            break;
                        }
                    }
                }

                focusableElements.item(currentFocusIndex).focus();
            }
        };
    }

    /**
     * Listen to modal panel open events. Fire custom ModalPanelOpen events if modal panel is one of the prequal modal panels
     */
    Y.EventDirector_js.listen('ModalPanel/open', null, function(e) {
        flowWrapper.setAttribute('aria-hidden', 'true');
        if (e.details.data) {
            e.details.data.container.fire('modalPanelOpen', e.details.data);
        }
        if (e.details.questionGroup) {
            e.details.questionGroup.container.fire('logSiteCatPage');
        }
    });

    Y.EventDirector_js.listen('ModalPanel/opened', null, enableFocusManager);

    /**
     * Listen to modal panel close events. Fire custom ModalPanelClose events if modal panel is one of the prequal modal panels
     */
    Y.EventDirector_js.listen('ModalPanel/close', null, function(e) {
        flowWrapper.removeAttribute('aria-hidden');
        if (e.details.data) {
            e.details.data.container.fire('modalPanelClose', e.details.data);
        }
    });

    Y.EventDirector_js.listen('ModalPanel/closed', null, function(e) {
        document.body.onkeydown= null;
    });

    Y.on('endInterstitialPanel', function(e) {
        var questionGroup;

        if (!e || !e.markupId || !interstitialPanels[e.markupId]) {
            return;
        }

        document.body.onkeydown = null;

        flowWrapper.removeAttribute('aria-hidden');

        questionGroup = interstitialPanels[e.markupId];

        if (questionGroup) {
            if (questionGroup.transientLayer) {
                questionGroup.transientLayer.removeClass('active');
            }

            if (questionGroup.interstitialAdContainer) {
                questionGroup.interstitialAdContainer.addClass('usaa-hidden');
            }

            /*show the label containers*/
            questionGroup.realEstateUIQuestionVOList.forEach(function(question, index, array) {
                question.container.addClass('usaa-hidden');
            });

            questionGroup.stopInterstitialCount = true;

            if (questionGroup.interstitialBanners) {
                questionGroup.interstitialBanners.each(function(node, index, array) {
                    if (index === 0) {
                        node.removeClass('usaa-hidden');
                        node.addClass('active');
                    } else {
                        node.addClass('usaa-hidden');
                        node.removeClass('active');
                    }
                });
            }
        }
    });

    Y.on('startInterstitialPanel', function(e) {
        var counterInterval, bannerInterval, bannerIndex = 0, bannerNext = 1, questionGroup, counterReachZero = false;

        if (!e || !e.markupId || !interstitialPanels[e.markupId]) {
            return;
        }
        activeInterstitialPanel = e.markupId;
        activeInterstitialPanelData = e;
        flowWrapper.setAttribute('aria-hidden', 'true');

        questionGroup = interstitialPanels[e.markupId];

        if (questionGroup) {
            questionGroup.container.fire('logSiteCatPage');
            questionGroup.stopInterstitialCount = false;
            if (questionGroup.transientLayer) {
                questionGroup.transientLayer.addClass('active');
            }

            if (questionGroup.interstitialAdContainer) {
                questionGroup.interstitialAdContainer.removeClass('usaa-hidden');
            }

            /*show the label containers*/
            questionGroup.realEstateUIQuestionVOList.forEach(function(question, index, array) {
                question.container.removeClass('usaa-hidden');
            });

            enableFocusManager({node:questionGroup.container.getDOMNode()});

            /*start counter*/
            if (questionGroup.interstitialCounterContainer) {
                questionGroup.interstitialCounterValue = questionGroup.originalInterstitialCounterValue;
                questionGroup.interstitialCounterContainer.set('innerHTML', questionGroup.interstitialCounterValue);
                questionGroup.stopInterstitialCount = false;
                counterInterval = setInterval(function() {
                    if (questionGroup.interstitialCounterValue === 0 || questionGroup.stopInterstitialCount) {
                        counterReachZero = true;
                        clearInterval(counterInterval);
                        if (questionGroup.interstitialCounterValue === 0) {
                            questionGroup.container.fire('interstitialCountDownCompletedEvent');
                        }
                        questionGroup.isQuestionGroupDirty = true;
                        questionGroup.container.fire('logSiteCat', (questionGroup.originalInterstitialCounterValue - questionGroup.interstitialCounterValue));
                        questionGroup.container.fire('logSiteCatQuestion');
                        return false;
                    } else {
                        questionGroup.interstitialCounterContainer.set('innerHTML', --questionGroup.interstitialCounterValue);
                        if (!dataObject.logSiteCatForEachQuestion) {
                            questionGroup.isQuestionGroupDirty = true;
                            questionGroup.container.fire('logSiteCat', (questionGroup.originalInterstitialCounterValue - questionGroup.interstitialCounterValue));
                        }
                    }
                }, 1000);
            }

            /*start carousel rotate animation*/
            if (questionGroup.interstitialBannerContainer && questionGroup.interstitialBanners.size() > 1) {
                bannerInterval = setInterval(function() {
                    var current;
                    var next;

                    if (counterReachZero || questionGroup.stopInterstitialCount) {
                        clearInterval(bannerInterval);
                        return false;
                    } else {
                        current = questionGroup.interstitialBanners.item(bannerIndex);
                        next = questionGroup.interstitialBanners.item(bannerNext);
                        if (current && next) {
                            current.removeClass('active');
                            next.removeClass('usaa-hidden');
                            setTimeout(function() {
                                current.addClass('usaa-hidden');
                                next.addClass('active');
                            }, 500);

                            if (bannerIndex === questionGroup.interstitialBanners.size() - 1) {
                                bannerIndex = 0;
                            } else {
                                bannerIndex++;
                            }
                            if (bannerNext === questionGroup.interstitialBanners.size() - 1) {
                                bannerNext = 0;
                            } else {
                                bannerNext++;
                            }
                        }
                    }
                }, 10000);
            }
        }
    });

    Y.on('creditHasSubmittedSuccessfully', function() {
        var liabilityInterval, areLiabilitiesRetrieved = false;
        if (dataObject.isCreditSubmitted) {
            liabilityInterval = setInterval(function() {
                if (areLiabilitiesRetrieved) {
                    clearInterval(liabilityInterval);
                    return false;
                } else {
                    Y.io(dataObject.preQualPageCallbackUrl + '&purpose=retrieveLiabilities&ts=' + new Date().getTime(), {
                        on: {
                            success: function(transactionId, response) {
                                var liabilitiesResponse = undefined;
                                var singleLiabilityYesRadio, singleLiabilityNoRadio;
                                try{
                                    /*calls code to display liabilities*/
                                    liabilitiesResponse = Y.JSON.parse(response.responseText);

                                    if (liabilitiesResponse.redirectUrl) {
                                        events.redirectToUrl(liabilitiesResponse.redirectUrl);
                                    } else if (liabilitiesResponse) {
                                        if (liabilitiesResponse.creditPulledDateExisted) {
                                            areLiabilitiesRetrieved = true;

                                            if (liabilitiesResponse.liabilities && liabilitiesResponse.liabilities.constructor === Array) {
                                                multipleLiabilitiesContainer = Y.one('#multiple-liabilities-modal-checkboxes-containers-emptyContainer');
                                                liabilities = liabilitiesResponse.liabilities;
                                                if (liabilitiesResponse.liabilities.length > 1) {
                                                    dataObject.hasMultipleLiabilities = true;
                                                    /*loop through liabilities and append checkboxes to multiple liabilities modal panel*/
                                                    liabilitiesResponse.liabilities.forEach(function(liability, index, array) {
                                                        var liabilityAccountNum = liability.liabAccountNo, liabilityNode, liabilityCheckbox;
                                                        if (!liabilitiesObj[liability.liabAccountNo]) {
                                                            liabilitiesObj[liability.liabAccountNo] = liability;
                                                            if (liabilityAccountNum && liabilityAccountNum.length > 4) {
                                                                liabilityAccountNum = liabilityAccountNum.substring(liabilityAccountNum.length-4, liabilityAccountNum.length);
                                                            }
                                                            if (multipleLiabilitiesContainer) {
                                                                liabilityNode = Y.Node.create(liabilitiesUnorderedList.format(
                                                                    index,
                                                                    liability.liabCompanyName,
                                                                    liabilityAccountNum,
                                                                    Y.USAA.bk.re.ui.RealEstateUI.valueFormatter.formatNumber(Number(liability.liabBalance),2,0),
                                                                    Y.USAA.bk.re.ui.RealEstateUI.valueFormatter.formatNumber(Number(liability.liabMoPmt),2,0),
                                                                    liability.liabNotIncl ? 'checked="true"' : ''));
                                                                liabilityCheckbox = liabilityNode.one('.pre-qual-liability-checkbox');
                                                                if (liabilityCheckbox) {
                                                                    liabilityCheckbox.setData('liability', liability);
                                                                    liabilityCheckbox.on('change', function(e) {
                                                                        var liab = this.getData('liability');

                                                                        if (liab) {
                                                                            if (this.get('checked')) {
                                                                                liab.liabNotIncl = true;
                                                                            } else {
                                                                                liab.liabNotIncl = false;
                                                                            }

                                                                            events.recordLiability({liability:liability});
                                                                        }
                                                                    });
                                                                }
                                                                multipleLiabilitiesContainer.append(liabilityNode);
                                                            }
                                                        }
                                                    });
                                                } else if (liabilitiesResponse.liabilities.length === 1) {
                                                    dataObject.hasMultipleLiabilities = false;
                                                    singleLiabilityYesRadio = Y.one('#single-liability-modal-question-radio-yes');
                                                    singleLiabilityNoRadio = Y.one('#single-liability-modal-question-radio-no');

                                                    if (singleLiabilityYesRadio) {
                                                        if (liabilities[0].liabNotIncl) {
                                                            singleLiabilityYesRadio.set('checked', true);
                                                        }
                                                        singleLiabilityYesRadio.setData('liability', liabilities[0]);
                                                        singleLiabilityYesRadio.on('change', function(e) {
                                                            var liability = this.getData('liability');

                                                            liability.liabNotIncl = true;

                                                            events.recordLiability({liability:liability});
                                                        });
                                                    }

                                                    if (singleLiabilityNoRadio) {
                                                        if (!liabilities[0].liabNotIncl) {
                                                            singleLiabilityNoRadio.set('checked', true);
                                                        }
                                                        singleLiabilityNoRadio.setData('liability', liabilities[0]);
                                                        singleLiabilityNoRadio.on('change', function(e) {
                                                            var liability = this.getData('liability');

                                                            liability.liabNotIncl = false;

                                                            events.recordLiability({liability:liability});
                                                        });
                                                    }
                                                } else {
                                                    dataObject.hasMultipleLiabilities = false;
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {
                                    return;
                                }
                            },
                            failure: function(transactionId, response) {
                                return;
                            }
                        }
                    });
                }
            }, 10000);
        }
    });

    Y.on('duResponseSuccess', function() {
        var duInterval;

        if (dataObject.isDUSubmitted) {
            duInterval = setInterval(function() {
                if (isDUResponseReceived) {
                    clearInterval(duInterval);
                    return false;
                } else {
                    Y.io(dataObject.preQualPageCallbackUrl + '&purpose=checkDuRequestReceived&ts=' + new Date().getTime(), {
                        on: {
                            success: function(transactionId, response) {
                                var obj, preQualifySuccessModal, preQualifyFailedModal;
                                try {
                                    obj = Y.JSON.parse(response.responseText);
                                    isDuAvailable = obj.isDuRequestReceived;

                                    if (obj.redirectUrl) {
                                        activeInterstitialPanelData.stopInterstitialCount = true;
                                        events.redirectToUrl(obj.redirectUrl);
                                    } else if (isDuAvailable) {
                                        isDUResponseReceived = true;
                                        activeInterstitialPanelData.stopInterstitialCount = true;
                                        Y.fire('endInterstitialPanel',{markupId:activeInterstitialPanel});
                                        if (obj.isDUApproved) {
                                            /*open success modal panel*/
                                            if(obj.displayFundingFee){
                                                var fundingFeeAmountLabel = Y.one('.funding-fee-value-label');
                                                if(fundingFeeAmountLabel  && obj.fundingFeeAmount){
                                                    var fundingFeeAmountContainer = Y.one('#prequalify-success-modal-label-fundingFee');
                                                    fundingFeeAmountContainer.removeClass('usaa-hidden');
                                                    fundingFeeAmountLabel.set('innerHTML', obj.fundingFeeAmount);
                                                }
                                            }
                                            if(obj.totalLoanAmount){
                                                var totalLoanAmountLabel = Y.one('.loan-amount-value-label');
                                                if(totalLoanAmountLabel){
                                                    totalLoanAmountLabel.set('innerHTML', obj.totalLoanAmount);
                                                }
                                            }
                                            preQualifySuccessModal = Y.one('#prequalify-success-modal .modal-containers');
                                            if (preQualifySuccessModal) {
                                                if (obj.displayProductName) {
                                                    Y.all('.pre-qualified-product-title').each(function(node, index, array) {
                                                        node.set('innerHTML', obj.displayProductName);
                                                    });
                                                }
                                                if (obj.displayProductTermsAndType) {
                                                    Y.all('.pre-qualified-loan-term-and-type').each(function(node, index, array) {
                                                        node.set('innerHTML', obj.displayProductTermsAndType);
                                                    });
                                                }
                                                Y.EventDirector_js.sendCommand('ModalPanel/open', {modalId:preQualifySuccessModal.get('id')});
                                            }
                                        } else {
                                            /*open fail modal panel*/
                                            preQualifyFailedModal = Y.one('#prequalify-failed-modal .modal-containers');
                                            if (preQualifyFailedModal) {
                                                Y.EventDirector_js.sendCommand('ModalPanel/open', {modalId:preQualifyFailedModal.get('id')});
                                            }
                                        }
                                    }
                                } catch (e) {
                                    /*do nothing*/
                                }
                            },
                            failure: function(transactionId, response) {
                                /*do nothing*/
                            }
                        }
                    });
                }
            }, 10000);
        }
    });

    Y.on('pq-app-start', function(){
        if (USAA && USAA.ent && USAA.ent.digitalData && USAA.ent.digitalData.event) {
            USAA.ent.digitalData.event.push({
                eventName: 'app_start'
            });
            logPage.call({
                event:{
                    eventParams:{
                        page:{
                            activityType:'acq',
                            businessUnit:'bnk',
                            productLOB:'hev',
                            productOffered:'fmt',
                            productQualifier:'fmt:n_a',
                            flowType:'app_mtg_prequal',
                            pageDesc:'pq_task_entry'
                        }
                    }
                }
            });
        }
    });

    Y.on('logLoanNumberSiteCat', function(loanNumber) {
        if (loanNumber) {
            events.logSiteCat.call({
                event:{
                    eventParams:{
                        page:{
                            activityType:'acq',
                            businessUnit:'bnk',
                            productLOB:'hev',
                            productOffered:'fmt',
                            productQualifier:'fmt:n_a',
                            flowType:'app_mtg_prequal',
                            pageDesc:'pq_task_entry'
                        },
                        component:{
                            attributes:{
                                customprop75:'app_mtg_prequal_loan_number:'
                            }
                        }
                    }
                }
            }, loanNumber);
            events.logSiteCatQuestion.call({
                event:{
                    eventParams:{
                        page:{
                            activityType:'acq',
                            businessUnit:'bnk',
                            productLOB:'hev',
                            productOffered:'fmt',
                            productQualifier:'fmt:n_a',
                            flowType:'app_mtg_prequal',
                            pageDesc:'pq_task_entry'
                        }
                    }
                }
            });
        }
    });

    Y.on('addInstertitialPanel', function(interstitialPanel) {
        interstitialPanels[interstitialPanel.markupId] = interstitialPanel;
    });

    Y.on('recordLoan', events.recordLoan);

    Y.on('showNodeAnim', events.showNodeAnim);
    Y.on('scrollToNode', events.scrollToNode);
    Y.on('addToQuestionVO', events.addToQuestionVO);
    Y.on('deleteFromQuestionVO', events.deleteFromQuestionVO);
    Y.on('clearInputBackend', clearInputBackend);
    Y.on('clearInputFrontend', clearInputFrontend);

    Y.USAA.bk.re.ui.RealEstateUI.events = events;

}, '1.0', {requires: ['node','event','event-custom','event-delegate','anim','anim-scroll','anim-easing','RealEstateUIValidations_js']});