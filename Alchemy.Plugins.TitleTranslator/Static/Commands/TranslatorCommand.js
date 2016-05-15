JQ = Alchemy.library("jQuery"),
pluginSettings = null;
/**
 * Creates an anguilla command using a wrapper shorthand.
 *
 * Note the ${PluginName} will get replaced by the actual plugin name.
 */
Alchemy.command("${PluginName}", "translate", {

    /**
     * If an init function is created, this will be called from the command's constructor when a command instance
     * is created.
     */

    init: function () {

        // Get the plugin Settings
        Alchemy.Plugins["${PluginName}"].Api.getSettings()
            .success(function (settings) {
                pluginSettings = settings;
            })
            .error(function (error) {

            });
    },

    /**
     * Whether or not the command is enabled for the user (will usually have extensions displayed but disabled).
     * @returns {boolean}
     */
    isEnabled: function () {
        return true;
    },

    /**
     * Whether or not the command is available to the user.
     * @returns {boolean}
     */
    isAvailable: function () {
        return true;
    },

    /**
     * Executes your command. You can use _execute or execute as the property name.
     */
    execute: function (selection) {
        // Get the selected item
        var item = $models.getItem(selection.getItem(0));

        // Get the title
        var title = item.getStaticTitle();

        // Read the API key from the settings.
        var key = pluginSettings.ProviderSettings.SDL.ApiKey;

        // Read the translation language from settings.
        var targetLanguage = pluginSettings.ProviderSettings.SDL.TranslateLanguage;

        // Do the translation.
        CallSDLTranslation(title, key, targetLanguage);


    }

});


function CallSDLTranslation(title, apiKey, targetLanguage) {
    // Format the API key 
    var keyString = "LC apiKey=" + apiKey;

    // Set the parameters for the POST request to detect the title language.
    var LanOptions = {
        url: 'https://lc-api.sdl.com/detect-language',
        type: 'post',
        headers: {
            "Authorization": keyString,
            "Content-type": "application/json"
        },
        data: JSON.stringify({ "text": encodeURI(title) })
    };

    // By default source language is English
    var sourceLanguageCode = "eng";

    var progress = $messages.registerProgress("Detecting text language...", null);

    JQ.ajax(LanOptions).done(
            function (data) {

                if (data.result.length > 0) {
                    // Get the detected language code for the title.
                    sourceLanguageCode = data.result[0].language.threeLetterCode;
                }
                else
                {
                    $messages.registerError("Title language can't be detected, You can contact SDL.", null);

                    progress.finish();

                    return;

                }
                
                console.log('Language detected as: ' + sourceLanguageCode);

                // If source and target languages are the same, no need to translate.
                if (sourceLanguageCode == targetLanguage)
                {
                    console.log('Source and target languages are the same, so no translation needed.');

                    $messages.registerGoal(title);

                    progress.finish();

                    return;
                }

                progress.finish();

                // Call the function to get the translation.
                GetSDLTranslation(title, sourceLanguageCode, targetLanguage, apiKey);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $messages.registerError("error:" + errorThrown);

                progress.finish();
            });

}

function GetSDLTranslation(title, sourceLanguageCode, targetLanguage, apiKey) {
    // data object for the translate call
    var dataObj = { "text": encodeURI(title), "from": sourceLanguageCode, "to": targetLanguage };

    var progress = $messages.registerProgress("Translating...", null);

    // Parameters for the translate POST request
    var options = {
        url: 'https://lc-api.sdl.com/translate',
        type: 'post',
        headers: {
            "Authorization": "LC apiKey=" + apiKey,
            "Content-type": "application/json"
        },
        data: JSON.stringify(dataObj)
    };


    JQ.ajax(options).done(
            function (data) {
                // Show the translated title as notification
                $messages.registerGoal(data.translation);

                progress.finish();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log("error:" + jqXHR.responseText);

                $messages.registerError("error:" + jqXHR.statusText);

                progress.finish();
            });

}


