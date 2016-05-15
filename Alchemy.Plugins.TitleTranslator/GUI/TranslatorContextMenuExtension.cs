using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace Alchemy.Plugins.TitleTranslator.GUI
{
    public class TranslatorContextMenuExtension : Alchemy4Tridion.Plugins.GUI.Configuration.ContextMenuExtension
    {
        public TranslatorContextMenuExtension()
        {
            AssignId = "TitleTranslateContextMenu";
            Name = "TitleTranslateContextMenu";
            
            // Use this property to specify where in the context menu your items will go
            InsertBefore = Constants.ContextMenuIds.MainContextMenu.Blueprinting;

           // Use AddItem() or AddSubMenu() to add items for this context menu

            //       element id      title        command name
            AddItem("alchemy_translate_cm", "Translate Title", "translate");

            // Add a dependency to the resource group that contains the files/commands that this toolbar extension will use.
            Dependencies.Add<TranslatorResourceGroup>();

            // apply the extension to a specific view.
            Apply.ToView(Constants.Views.DashboardView);
            
        }
    }
}
