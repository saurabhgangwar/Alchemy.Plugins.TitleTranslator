using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace Alchemy.Plugins.TitleTranslator.GUI
{
    public class TranslatorCommandSet : Alchemy4Tridion.Plugins.GUI.Configuration.CommandSet
    {
        public TranslatorCommandSet()
        {
            // we only need to add the name of our command
            AddCommand("translate");
           
        }
    }
}
