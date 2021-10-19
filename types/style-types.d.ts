/**
 * Extend the default browser CSS Style object with the custom properties supported by Gameface
 * More info: https://coherent-labs.com/Documentation/cpp-gameface/db/d44/interface_c_s_s_style_declaration.html
 */
interface GamefaceCSSStyleDeclaration {
	topPX: number
	leftPX: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CSSStyleDeclaration extends GamefaceCSSStyleDeclaration {}
