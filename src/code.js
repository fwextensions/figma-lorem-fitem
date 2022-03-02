// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadFontsAsync, main, selection } from "./utils/plugin";
const sentences = [
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    "Suspendisse hendrerit ligula quis velit pharetra egestas.",
    "Ut molestie elit non massa.",
    "Vivamus tincidunt bibendum velit.",
    "Quisque nisl diam, nonummy eu, lobortis consequat, mollis ut, tellus.",
    "In iaculis.",
    "Integer iaculis justo.",
    "Duis velit enim, tristique sed, elementum vel, vehicula condimentum, felis.",
    "Aenean nisi odio, porta vel, tristique vel, semper mollis, mi.",
    "Donec gravida, ipsum vitae convallis sodales, urna justo commodo nunc, non venenatis nisl urna non purus.",
    "Mauris lectus lorem, rhoncus non, tincidunt ut, laoreet ac, augue.",
    "Aenean dignissim diam at risus.",
    "Aliquam adipiscing elementum lorem.",
    "Aliquam ut erat.",
    "Donec eget urna eget est euismod imperdiet.",
    "Etiam sagittis nulla at quam.",
    "In massa.",
    "Integer leo tortor, dignissim nec, volutpat id, luctus non, nisi.",
    "Morbi iaculis mollis felis.",
    "Ut ullamcorper tortor.",
    "In et sapien.",
    "Cras id enim.",
    "Quisque venenatis urna ac nulla.",
    "Praesent tincidunt.",
    "Donec quis elit id elit pretium aliquam.",
    "Ut ultrices semper felis.",
    "Nullam vel nisi sit amet diam tristique aliquet.",
    "Suspendisse ac mauris.",
    "Fusce libero felis, ultrices sed, tincidunt vel, auctor id, velit.",
    "Etiam varius sapien in turpis.",
    "Suspendisse eros nibh, cursus vel, malesuada id, ullamcorper et, odio.",
    "Proin ac velit et ligula aliquam molestie.",
    "Proin congue sapien eget nunc.",
    "Sed at orci.",
    "Aenean ornare, velit eget bibendum adipiscing, turpis ante cursus mauris, in porta dolor mauris eget mi.",
    "In bibendum, sem quis varius interdum, urna neque gravida est, ultricies pulvinar nisl dolor non tortor.",
    "Phasellus tortor enim, elementum quis, consectetuer ut, ultrices ut, nisi.",
    "Quisque quam libero, pharetra eu, mattis et, auctor eu, elit.",
    "Quisque lacinia mollis ligula.",
    "In est.",
    "Sed vel lacus vel magna gravida scelerisque.",
    "Nullam rutrum felis id sem.",
    "Nulla tincidunt semper lorem.",
    "Nunc vitae urna eget mi convallis iaculis.",
    "Ut tincidunt ullamcorper lectus.",
    "Integer interdum, nisi ac sollicitudin rhoncus, quam nisl mollis enim, eget condimentum erat purus eu orci.",
    "Nunc tempus, diam id iaculis accumsan, odio diam faucibus dui, at pharetra quam tortor pulvinar pede.",
    "Sed eu turpis sed nisl rutrum ornare.",
    "Etiam nec urna.",
    "Donec tempor fringilla neque.",
    "Maecenas a metus.",
    "Vivamus congue semper dolor.",
    "Curabitur at augue gravida libero vestibulum dignissim.",
    "Mauris leo sapien, laoreet id, aliquam in, tincidunt id, leo.",
    "Pellentesque venenatis turpis a sem.",
    "Pellentesque aliquet dui varius velit blandit aliquet.",
    "Aliquam nec nulla ac nisi dignissim dictum.",
    "Phasellus quis tortor.",
    "In ullamcorper justo vitae mi.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.",
    "Donec risus purus, iaculis ac, ornare at, cursus eu, diam.",
    "Praesent fermentum, nisl ac sodales laoreet, velit lacus fermentum nulla, sit amet eleifend tellus nisi sed augue.",
    "Etiam iaculis, nisl eu imperdiet tincidunt, neque lacus ornare leo, non ultrices arcu justo ut enim.",
    "Vivamus augue risus, rhoncus quis, tincidunt ac, posuere eu, nisl.",
    "Sed eget mi.",
    "Nam non lectus.",
    "Sed adipiscing purus nec tortor.",
    "Nullam turpis erat, placerat eget, pellentesque ac, dapibus nec, felis.",
    "Sed dapibus lacus vel velit.",
    "Integer quis neque.",
    "Aliquam in erat venenatis arcu ullamcorper fringilla.",
    "Donec elementum interdum sapien.",
    "In hac habitasse platea dictumst.",
    "Vestibulum imperdiet diam sollicitudin risus.",
    "Duis ornare dictum mi.",
    "In vitae odio non neque aliquet ultricies.",
    "Nullam a pede eu risus consequat euismod.",
    "Ut massa nibh, tempus interdum, viverra sit amet, vehicula nec, enim.",
    "Duis ac felis.",
    "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    "Praesent auctor accumsan urna.",
    "Suspendisse sed massa at metus scelerisque accumsan.",
    "Aliquam commodo rhoncus mi.",
    "Sed commodo turpis et magna.",
    "Curabitur non tellus.",
    "Cras nunc mi, aliquam semper, suscipit a, dictum elementum, velit.",
    "Quisque vulputate odio id ante.",
    "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Fusce quam ligula, bibendum in, rutrum in, pharetra non, erat.",
    "Etiam dui justo, imperdiet et, dapibus sodales, iaculis ac, dui.",
    "Curabitur suscipit, massa eget luctus nonummy, justo velit fringilla odio, ac convallis justo ligula non purus.",
    "Sed sodales lacus ac neque.",
    "Nulla metus ipsum, porttitor eget, ullamcorper a, blandit semper, sapien.",
    "Donec in elit vel sapien rutrum aliquam.",
    "Nullam massa massa, fringilla sit amet, viverra vitae, sodales sit amet, arcu.",
    "Fusce sem lacus, cursus faucibus, nonummy a, cursus ut, urna.",
    "Duis ultrices mollis metus.",
    "Maecenas vel odio.",
    "Nulla rhoncus rhoncus magna.",
    "Proin placerat.",
    "Morbi mauris nisl, fringilla in, condimentum sit amet, posuere quis, nulla.",
    "Cras feugiat.",
    "Curabitur ultrices, diam ut adipiscing posuere, orci dui ornare nulla, at sagittis libero mauris ut risus.",
    "Donec tristique tortor nec metus.",
    "Quisque lacus risus, commodo eu, tristique quis, sagittis sit amet, eros.",
    "Praesent id felis a tellus mollis luctus.",
    "Cras nisi sapien, ultricies nec, dapibus ut, vehicula ac, pede.",
    "Maecenas quis turpis nec nulla auctor mattis.",
    "In pulvinar egestas libero.",
    "Donec sed justo.",
    "In et risus.",
    "Curabitur sapien lorem, dignissim at, condimentum vitae, semper quis, magna.",
    "Proin dolor ipsum, commodo eget, varius vel, molestie et, elit.",
    "Aliquam erat volutpat.",
    "Duis in dolor.",
    "Morbi ipsum.",
    "Quisque ut sapien nec arcu porta aliquam.",
    "Maecenas dolor.",
    "Donec congue lacus ut enim.",
    "Fusce venenatis congue magna.",
    "Aliquam venenatis sem a neque.",
    "Donec porta, arcu sit amet eleifend scelerisque, felis augue mattis erat, quis molestie quam nisi eu erat.",
    "Ut fringilla.",
    "Aliquam feugiat pede vel nisl.",
    "Fusce rhoncus.",
    "Praesent sed mi a dui tempor vulputate.",
    "Phasellus consectetuer nulla id metus.",
    "Nam magna odio, venenatis non, venenatis quis, iaculis eget, mauris.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.",
    "Nunc ante nibh, porttitor quis, egestas ut, malesuada auctor, tellus.",
    "Integer scelerisque urna in sapien.",
    "Curabitur dignissim.",
    "Nullam libero libero, vestibulum ut, consectetuer ac, luctus id, sapien.",
    "Proin quis ligula.",
    "Proin est nisi, rhoncus eu, dignissim nec, feugiat quis, dui.",
    "Phasellus ac tortor.",
    "Donec interdum pede sit amet urna.",
    "Aliquam lacinia tristique leo.",
    "Sed at arcu ac arcu pharetra commodo.",
    "Proin sit amet leo in nibh congue tincidunt.",
    "Vivamus et dolor eget odio eleifend ultricies.",
    "Nunc vel odio.",
    "Pellentesque nec arcu vel velit laoreet rhoncus.",
    "Aenean fermentum pellentesque magna.",
    "Donec pellentesque, neque non faucibus suscipit, massa est faucibus sapien, eget sodales dolor lacus ac pede.",
    "Cras vitae ante sed odio porta sagittis.",
    "Duis consectetuer augue a magna.",
    "Nunc ipsum.",
    "Sed est pede, ultrices id, tempor suscipit, ornare et, nisl.",
    "Aliquam in sapien.",
    "Etiam eu ipsum eu urna tincidunt dignissim.",
    "Maecenas quis mauris.",
    "Nam nunc.",
    "In quam tortor, aliquet ac, dictum sed, ultricies in, libero.",
    "Praesent lobortis, lectus at ullamcorper lacinia, diam nibh euismod metus, sed semper turpis nisi et sapien.",
    "Aliquam fermentum nunc nec felis.",
    "In sit amet quam in mi mattis ullamcorper.",
    "Suspendisse vel neque.",
    "Nullam eu ante.",
    "Sed tempor dolor.",
    "Duis ut neque eu nulla consequat semper.",
    "Donec malesuada.",
    "Pellentesque cursus mauris sit amet nisl.",
    "Nullam aliquet tellus ac ipsum.",
    "Maecenas suscipit commodo diam.",
    "Curabitur imperdiet.",
    "Fusce porta.",
    "Aliquam a risus.",
    "Praesent mauris massa, imperdiet ornare, venenatis eget, fringilla ut, tellus.",
    "Nulla non turpis.",
    "Donec sodales.",
    "Morbi tincidunt imperdiet nunc.",
    "Integer ac odio.",
    "Mauris non dui.",
    "Sed consequat, turpis ac laoreet interdum, mi purus varius massa, vitae vehicula massa felis vel tellus.",
    "Fusce pretium.",
    "Maecenas convallis elementum libero.",
    "Donec pulvinar nibh sed leo.",
    "Fusce eget dolor.",
    "Ut nonummy mauris ut libero.",
    "Nunc urna.",
    "Integer dignissim volutpat sapien.",
    "Vivamus suscipit nisl vitae libero.",
    "Sed quis velit.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Donec malesuada consectetuer dolor.",
    "Curabitur vulputate.",
    "Quisque malesuada.",
    "Aenean euismod.",
    "Pellentesque et metus non magna viverra fermentum.",
    "Sed tincidunt.",
    "Morbi condimentum tincidunt massa.",
    "Phasellus pellentesque, elit vel ultricies congue, risus massa dignissim enim, nec congue augue urna et purus.",
    "Aenean sodales diam a lorem.",
    "Fusce tristique.",
    "Nunc elit.",
    "Aenean lacinia urna eget orci.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Maecenas nibh magna, scelerisque et, placerat quis, aliquet in, metus.",
    "Fusce facilisis lectus a lectus.",
    "Vivamus ullamcorper lorem sit amet lorem.",
    "Sed nec sapien.",
    "Integer placerat tellus a mauris.",
    "Pellentesque in erat.",
    "Pellentesque non pede eu orci feugiat dapibus.",
    "Morbi pulvinar sagittis sapien.",
    "Integer nisl enim, faucibus et, pellentesque quis, vehicula ac, velit.",
    "Vivamus pede dolor, lobortis eu, porttitor nec, vestibulum non, nunc.",
    "Praesent in dolor eget odio dapibus pretium.",
    "Vestibulum eu tellus.",
    "Fusce a massa.",
    "Cras faucibus.",
    "Pellentesque mauris sapien, ultrices id, adipiscing vel, condimentum ut, justo.",
    "Duis ut nisl.",
    "Integer ac massa ut quam dapibus posuere.",
    "Duis nisi tellus, laoreet non, venenatis nec, accumsan at, velit.",
    "Suspendisse et nulla sit amet nulla pulvinar adipiscing.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.",
    "Sed nec metus sit amet purus aliquet rutrum.",
    "Nunc in risus.",
    "Aenean malesuada lorem et elit.",
    "Nam risus.",
    "Nunc et dui.",
    "Donec ultricies.",
    "Duis at risus.",
    "Aenean ante lorem, lobortis quis, ultrices id, condimentum nec, sem.",
    "Proin eros purus, adipiscing id, adipiscing in, accumsan eu, odio.",
    "In pretium magna posuere elit.",
    "Curabitur elementum ligula ac nulla.",
    "Vestibulum libero magna, eleifend sit amet, consequat vel, vulputate sit amet, erat.",
    "Nulla eget nisl.",
    "Etiam nec justo et orci iaculis molestie.",
    "Cras semper dolor quis odio.",
    "Ut est magna, cursus at, hendrerit imperdiet, rutrum non, urna.",
    "Pellentesque sed lorem sed enim hendrerit viverra.",
    "Suspendisse potenti.",
    "Nulla sem magna, venenatis venenatis, consectetuer id, adipiscing ac, elit.",
    "Suspendisse potenti.",
    "Aliquam ullamcorper quam id libero.",
    "Maecenas scelerisque nunc ut neque.",
    "Morbi pulvinar dapibus tellus.",
    "Praesent sed velit.",
    "Duis ut leo.",
    "Fusce quam diam, euismod ac, dictum eget, tempor sit amet, lectus.",
    "Cras pulvinar.",
    "Maecenas pretium.",
    "Praesent vestibulum tortor sit amet lacus.",
    "Sed viverra.",
    "Phasellus feugiat nisl a tortor.",
    "Donec hendrerit auctor leo.",
    "Nulla a nunc.",
    "Cras tortor.",
    "Praesent posuere, nulla nec tincidunt volutpat, justo neque viverra nisi, vel ultricies ipsum metus luctus lorem.",
    "Proin sollicitudin, orci ac scelerisque eleifend, erat libero scelerisque nulla, ac mattis lectus lectus nec erat.",
    "Donec non tellus sed justo auctor vulputate.",
    "Vivamus eget lorem vel magna tempus ullamcorper.",
    "Nulla volutpat tincidunt erat.",
    "Integer eleifend nisl vestibulum leo.",
    "Phasellus dictum tempor purus.",
    "Vestibulum vel lacus.",
    "Nam in enim sit amet lorem tincidunt eleifend.",
    "Sed faucibus congue turpis.",
    "Donec ipsum lorem, faucibus id, rhoncus eget, porta non, arcu.",
    "Donec laoreet.",
    "Morbi venenatis orci.",
    "Sed ullamcorper, diam ac gravida aliquet, risus sapien rhoncus augue, vitae sollicitudin tellus nisi nec nisi.",
    "Pellentesque euismod ligula vitae nunc.",
    "Quisque dui.",
    "In lobortis accumsan felis.",
    "Curabitur eleifend, diam non fringilla dignissim, sem libero porta metus, at tincidunt purus risus at lectus.",
    "Nulla non turpis.",
    "Sed posuere.",
    "Integer ac eros.",
    "Aenean et arcu quis odio interdum commodo.",
    "Nam eu massa.",
    "Phasellus porttitor.",
    "Maecenas gravida est in turpis.",
    "Nunc a risus.",
    "Fusce sed velit.",
    "Morbi iaculis, turpis at porta blandit, dolor quam pulvinar arcu, non interdum lectus metus sagittis nisi.",
    "Praesent nisl.",
    "Praesent enim dui, ultrices ut, mattis eu, vestibulum at, diam.",
    "Etiam vitae dui.",
    "Nunc nunc nunc, molestie ut, mollis eu, ullamcorper ut, mi.",
    "Etiam convallis.",
    "Suspendisse ut nibh nec nisi fermentum posuere.",
    "Vestibulum vel risus.",
    "In convallis odio id augue.",
    "Nunc placerat nisl eu erat.",
    "Donec dapibus, orci id varius convallis, metus mauris tempus velit, at porttitor erat enim quis turpis.",
    "In hac habitasse platea dictumst.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Phasellus eu leo non lectus pretium fringilla.",
    "Maecenas eget metus.",
    "Nam consequat ornare ante.",
    "Suspendisse elementum auctor turpis.",
    "Nunc scelerisque, dolor quis fermentum auctor, est pede ullamcorper massa, at luctus lorem lectus quis tortor.",
    "Morbi in ligula in tellus convallis ultrices.",
    "Sed nunc.",
    "Aenean at arcu.",
    "Phasellus ut lorem.",
    "Suspendisse id metus.",
    "Suspendisse quis ligula ut odio suscipit tincidunt.",
    "Curabitur mi libero, scelerisque eu, cursus semper, tempor quis, ante.",
    "Aliquam erat volutpat.",
    "Cras sed elit.",
    "Quisque velit sapien, gravida quis, dictum id, vulputate quis, tortor.",
    "Curabitur tellus mi, dapibus quis, pellentesque faucibus, ornare et, nulla.",
    "Vivamus sed felis.",
    "Aliquam gravida ligula bibendum elit.",
    "Quisque massa risus, porta sed, placerat ut, pretium nonummy, sem.",
    "Sed vitae justo quis nulla consectetuer sagittis.",
    "Nam at metus.",
    "Vestibulum libero massa, consequat id, tristique sed, pellentesque et, nisi.",
    "Vivamus ipsum.",
    "Fusce lacus metus, semper nec, ultricies non, pellentesque vitae, mi.",
    "Proin ac sem eget pede malesuada ultrices.",
    "Etiam commodo dolor.",
    "Donec elementum auctor metus.",
    "Maecenas aliquam, dui et pulvinar tincidunt, lorem turpis imperdiet turpis, a vulputate pede neque non erat.",
    "Nulla tincidunt pretium massa.",
    "Morbi sed risus ac purus dignissim gravida.",
    "Proin accumsan, purus eget tempus sodales, sem nisl scelerisque purus, nec cursus ante lacus eget tellus.",
    "Donec venenatis lorem sit amet erat vehicula hendrerit.",
    "Etiam vel elit.",
    "Donec id tellus nec urna placerat consectetuer.",
    "Vivamus justo lorem, fermentum non, convallis non, tristique at, metus.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Pellentesque nisi.",
    "Etiam et risus.",
    "Proin auctor.",
    "Proin at pede at libero dapibus euismod.",
    "Maecenas massa erat, scelerisque at, pretium sed, vulputate ut, lorem.",
    "Sed nisi eros, volutpat non, fermentum ac, congue ut, libero.",
    "Nulla bibendum tortor ut ipsum.",
    "Nunc aliquet magna.",
    "Donec rutrum.",
    "Pellentesque ut quam.",
    "Praesent elit lectus, accumsan sit amet, scelerisque in, fringilla ac, velit.",
    "Ut at lorem at purus tristique scelerisque.",
    "In adipiscing ante at libero.",
    "Nunc eros lacus, euismod at, ornare porttitor, molestie eu, nisl.",
    "Integer egestas, odio nec aliquam lacinia, purus nisl tincidunt augue, ut sagittis quam sapien ac elit.",
    "Vivamus rhoncus semper quam.",
    "Pellentesque vitae odio.",
    "Praesent commodo, massa sed commodo sollicitudin, est sapien dapibus neque, ut pulvinar eros pede ut ante.",
    "Suspendisse nulla.",
    "Mauris felis neque, aliquam nec, fringilla a, feugiat non, nulla.",
    "Mauris fringilla sapien quis mi.",
    "Donec condimentum, purus eget dignissim aliquet, elit arcu facilisis nisl, ac pretium quam turpis consequat enim.",
    "Donec commodo aliquet urna.",
    "Vestibulum dictum.",
    "Quisque at nunc venenatis ligula sagittis nonummy.",
    "Nullam euismod, diam ut ultricies ullamcorper, arcu massa elementum odio, ut feugiat nibh nunc et erat.",
    "Cras aliquam, ligula in malesuada lacinia, velit sem bibendum lacus, id scelerisque mauris nibh eu nisl.",
    "Suspendisse porta.",
    "Duis eu nisl.",
    "Vestibulum ac nisi nec quam lobortis hendrerit.",
    "Vestibulum tristique nisi ac eros.",
    "Curabitur justo odio, faucibus sed, facilisis nec, ullamcorper eu, orci.",
    "Morbi mattis pretium metus.",
    "Quisque porta.",
    "Donec eu nibh.",
    "Vestibulum nonummy sapien vel libero.",
    "Sed metus augue, tempus vitae, vehicula eget, nonummy ut, leo.",
    "Aliquam tincidunt, arcu eget viverra egestas, elit lorem semper orci, id consequat quam eros ut ipsum.",
    "Morbi in metus pellentesque mi adipiscing viverra.",
    "Nulla felis nibh, sollicitudin volutpat, varius venenatis, ultricies at, purus.",
    "Nulla adipiscing condimentum dolor.",
    "Pellentesque ut ante vitae turpis volutpat ornare.",
    "Aenean convallis rhoncus mi."
];
function getRandomSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}
/*
function main(
    func)
{
    return func()
        .catch(console.error)
        .finally(figma.closePlugin);
}


function selection(
    filterType: NodeType): SceneNode[]
{
    let result: SceneNode[] = [...figma.currentPage.selection];

    if (filterType) {
        result = result.filter(({type}) => type === filterType);
    }

    return result;
}


function loadFontsAsync(
    el: TextNode): Promise<void[]>
{
    return Promise.all(
        el.getRangeAllFontNames(0, el.characters.length).map(figma.loadFontAsync)
    );
}
*/
// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
    main(() => __awaiter(void 0, void 0, void 0, function* () {
        const textNodes = selection("TEXT");
        let node;
        for (node of textNodes) {
            yield loadFontsAsync(node);
            const targetHeight = node.height;
            // const originalAutoResize = node.textAutoResize;
            node.textAutoResize = "HEIGHT";
            node.characters = "";
            let { height } = node;
            while (height < targetHeight) {
                node.characters += getRandomSentence() + " ";
                height = node.height;
            }
            node.characters = node.characters.trim();
            while (height > targetHeight) {
                node.characters = node.characters.slice(0, node.characters.lastIndexOf(" "));
                height = node.height;
            }
            node.textAutoResize = "NONE";
            node.resize(node.width, targetHeight);
        }
    }));
    // .then(() => console.log("DONE", `|${figma.command}|`));
    /*
      // This shows the HTML page in "ui.html".
      figma.showUI(__html__);

      // Calls to "parent.postMessage" from within the HTML page will trigger this
      // callback. The callback will be passed the "pluginMessage" property of the
      // posted message.
      figma.ui.onmessage = msg => {
        // One way of distinguishing between different types of messages sent from
        // your HTML page is to use an object with a "type" property like this.
        if (msg.type === 'create-shapes') {
          const nodes: SceneNode[] = [];
          for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
          }
          figma.currentPage.selection = nodes;
          figma.viewport.scrollAndZoomIntoView(nodes);
        }
      };
    */
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
    // If the plugins isn't run in Figma, run this code
}
else {
    // This plugin will open a window to prompt the user to enter a number, and
    // it will then create that many shapes and connectors on the screen.
    // This shows the HTML page in "ui.html".
    figma.showUI(__html__);
    // Calls to "parent.postMessage" from within the HTML page will trigger this
    // callback. The callback will be passed the "pluginMessage" property of the
    // posted message.
    figma.ui.onmessage = msg => {
        // One way of distinguishing between different types of messages sent from
        // your HTML page is to use an object with a "type" property like this.
        if (msg.type === 'create-shapes') {
            const numberOfShapes = msg.count;
            const nodes = [];
            for (let i = 0; i < numberOfShapes; i++) {
                const shape = figma.createShapeWithText();
                // You can set shapeType to one of: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT'
                shape.shapeType = 'ROUNDED_RECTANGLE';
                shape.x = i * (shape.width + 200);
                shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
                figma.currentPage.appendChild(shape);
                nodes.push(shape);
            }
            ;
            for (let i = 0; i < (numberOfShapes - 1); i++) {
                const connector = figma.createConnector();
                connector.strokeWeight = 8;
                connector.connectorStart = {
                    endpointNodeId: nodes[i].id,
                    magnet: 'AUTO',
                };
                connector.connectorEnd = {
                    endpointNodeId: nodes[i + 1].id,
                    magnet: 'AUTO',
                };
            }
            ;
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
        }
        // Make sure to close the plugin when you're done. Otherwise the plugin will
        // keep running, which shows the cancel button at the bottom of the screen.
        figma.closePlugin();
    };
}
;
