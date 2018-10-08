var $;
var VORLON;
(function (VORLON) {
    var OfficeOutlook = (function () {
        function OfficeOutlook(dashboardPlugin) {
            var _this = this;
            this.apis = [
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getSelectedDataAsync");
                    fn.elements = [VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".coerciontyp", "Coercion type", "text")];
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "setSelectedDataAsync");
                    var data = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".data", "Data", "Hello World");
                    var coercionType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".coerctionType", "Type", "text");
                    fn.elements.push(data, coercionType);
                    fn.getArgs = function () {
                        var args = [data.value, {
                                coercionType: coercionType.value === "" ? null : coercionType.value
                            }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getRegExMatches"));
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getUserIdentityTokenAsync"));
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getCallbackTokenAsync"));
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getRegExMatchesByName");
                    var getRegExMatchesByName = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getRegExMatchesByName", "Time value", Date.now().toString());
                    fn.elements.push(getRegExMatchesByName);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "displayReplyAllForm");
                    var value = JSON.stringify({ 'htmlBody': 'hi' });
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Xml value :", value);
                    fn.elements.push(formData);
                    fn.getArgs = function () {
                        var args = [{
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox", "makeEwsRequestAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".xmlValue", "Xml value :", "<?xml version=\"1.0\" encoding=\"utf-8\"?>");
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox", "convertToLocalClientTime");
                    var timeValue = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".timeValue", "Time value :", Date.now().toString());
                    fn.elements.push(timeValue);
                    fn.getArgs = function () {
                        var args = [{
                                value: timeValue.value,
                                type: 'Datetime'
                            }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getEntities"));
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "setSelectedDataAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Data");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getAsync", "Coercion type", "text");
                    fn.elements.push(formData, getAsync);
                    fn.getArgs = function () {
                        var args = [formData.value, { coercionType: getAsync.value }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "setAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Data");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".formData", "Coercion type", "text");
                    fn.elements.push(formData, getAsync);
                    fn.getArgs = function () {
                        var args = [formData.value, { coercionType: getAsync.value }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "prependAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Data");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".formData", "Coercion type", "text");
                    fn.elements.push(formData, getAsync);
                    fn.getArgs = function () {
                        var args = [formData.value, { coercionType: getAsync.value }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "getTypeAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "getAsync");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getAsync", "Coercion type", "text");
                    fn.elements.push(getAsync);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getEntitiesByType");
                    var entityType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".entityType", "Office.MailboxEnums.EntityType");
                    fn.elements.push(entityType);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getFilteredEntitiesByName");
                    var entityType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getFilteredEntitiesByName", "Entity name");
                    fn.elements.push(entityType);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "saveAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "addFileAttachmentAsync");
                    var uri = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".uri", "Uri");
                    var attachmentName = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".apiVersion", "Attachment name");
                    fn.elements.push(uri, attachmentName);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "removeAttachmentAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".removeAttachmentAsync", "id");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "getAllAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "addAsync");
                    var key = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".notificationMessages.addAsync.key", "key");
                    var jsonMessage = JSON.stringify({ type: "progressIndicator", message: "Processing the message ..." });
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".notificationMessages.addAsync.json", "JSON message", jsonMessage);
                    fn.getArgs = function () {
                        var args = [key.value,
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(key, formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "removeAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + "notificationMessages.removeAsync", "key");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "replaceAsync");
                    var key = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".notificationMessages.replaceAsync.key", "key");
                    var jsonMessage = JSON.stringify({ type: "informationalMessage", message: "The message was processed successfuly", icon: "iconid", persistent: false });
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".notificationMessages.replaceAsync.json", "JSON message", jsonMessage);
                    fn.getArgs = function () {
                        var args = [key.value,
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(key, formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.to", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.to", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.to", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.cc", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.cc", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.cc", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.bcc", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.bcc", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.bcc", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.requiredAttendees", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.requiredAttendees", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.requiredAttendees", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.optionalAttendees", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.optionalAttendees", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.optionalAttendees", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                }, function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "get");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "key");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "remove");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "key");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "set");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "key");
                    var value = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "value");
                    fn.elements.push(id, value);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "saveAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.subject", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.subject", "setAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "Subject");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.start", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.start", "setAsync");
                    var timeValue = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "UTC Datetime");
                    fn.getArgs = function () {
                        var args = [{
                                value: timeValue.value,
                                type: 'Datetime'
                            }];
                        return args;
                    };
                    fn.elements.push(timeValue);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.end", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.end", "setAsync");
                    var timeValue = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "UTC Datetime");
                    fn.getArgs = function () {
                        var args = [{
                                value: timeValue.value,
                                type: 'Datetime'
                            }];
                        return args;
                    };
                    fn.elements.push(timeValue);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.location", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.location", "setAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "Location");
                    fn.elements.push(id);
                    return fn;
                }
            ];
            this.dashboardPlugin = dashboardPlugin;
        }
        OfficeOutlook.prototype.execute = function () {
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "to");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "bcc");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "cc");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "optionalAttendees");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "requiredAttendees");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "subject");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "body");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "start");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "end");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "location");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "notificationMessages");
            VORLON.OfficeTools.AddZone("window.Office.context", "roamingSettings");
            this.apis.forEach(function (api) {
                api().addTree();
            });
        };
        return OfficeOutlook;
    }());
    VORLON.OfficeOutlook = OfficeOutlook;
})(VORLON || (VORLON = {}));
