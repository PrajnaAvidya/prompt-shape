# PromptShaper
PromptShaper is a templating language for efficiently constructing LLM prompts.

## Why
I'm a programmer, and like many I've seen productivity gains due to the assistance of LLMs. The standard way of interacting with a model through a chat interface works great for basic queries, but I do a lot of what I call "non-linear" workflows and found myself spending too much time copying and pasting text fragments to construct the exact prompts I wanted to run. I was working on my own custom LLM chat client and wanted to build a UI to construct dynamic and reusable prompts to send to the OpenAI API and realized I needed an engine to run it. Inspired by templating engines like Handlebars, I built my own variant specifically designed for executing highly customized GPT/LLM prompts.

## Features
- Templating Engine: Work out of a text editor/IDE and save a lot of time by avoiding repetitive copy/pasting of text fragments. Through the use of slots, variables, and functions you can dynamically load and render text into LLM prompts.
- CLI: A variety of command-line options to customize usage, and you can specify various input/output formats.
- Interactive Mode (OpenAI key required): After constructing your prompt you can continue your conversation in the command line, or load a previous conversation from JSON or text and continue in interactive mode. You can even use PromptShaper tags in interactive mode!

## Requirements
node/npm/npx - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Usage/CLI Options
Run the CLI using this format: `npx prompt-shaper [options] <input>`
Run `npx prompt-shaper -h` to see a complete list of CLI options. Here are some important ones:
- `<input>` is treated as a file path by default, use `-is` or `--is-string` to treat input as a template string 
  - Example (default file behavior): `npx prompt-shaper my_template.ps.md`
  - Example (string input): `npx prompt-shaper -is "my PromptShaper template"`
- Enter interactive mode by specifying `-i` (send the rendered prompt to the OpenAI API and continue the conversation)
  - Example: `npx prompt-shaper my_template.ps.md -i`
  - You can start a new conversation in interactive mode with: `npx prompt-shaper -i`
- Save output to a text file: `-s <outputPath>`
  - Example: `npx prompt-shaper my_template.ps.md -s output.md`
- Load a previous conversation from text and continue in interactive mode with `-lt`
  - Example: `npx prompt-shaper -lt output.md`

**Note: you must set the OPENAI_API_KEY env var for calls to OpenAI to work.**

## Environment Variables
In addition to command-line options, PromptShaper supports environment variables to configure default behavior. Command-line options take precedence over environment variables if both are specified. For example `PROMPT_SHAPER_MODEL` to change the default OpenAI model and `PROMPT_SHAPER_PROMPT` to change the system prompt. See `cli.ts` for the complete list.

## Examples
See the `samples` directory and try running them with the parser.

## Terminology
- **Template** - A piece of text that is rendered by the parser. I'm using the .ps.md extension for the samples.
- **Variable** - A value loaded from a template file, or defined inline in a template. Variables are defined using single braces and are either defined as a single tag, or with matching tags wrapped around text. String variables can be rendered as templates.
- **Slot** - Renders the contents of a variable or function using double braces.
- **Parameters** - One or more arguments passed to a slot or a function. Parameters can be strings or numbers.
- **Function** - Does "something" and the result is rendered on page, or assigned to a variable.

## Templates, Slots, Variables
A template is a file or string that gets loaded into a variable by the PromptShaper parser and is then rendered.

Templates can contain one or more inline variable definitions. They are defined using single braces can be single line or multi line using tags.
```
{stringVariable = "hello world"}

{numberVariable = 42.1}

{multilineVariable}
This is a variable spanning multiple lines, but the tags can be used on a single line if desired. Multiline variables are always strings.
{/multilineVariable}
```

A template can contain one or more slots which are rendered by replacing their content with variables.
```
This will render the contents of the string variable: {{stringVariable}}

This will render the contents of the number variable: {{numberVariable}}

This will render the contents of the multiline variable, and the @ symbol means it will be rendered as raw text (will not be parsed): {{@multilineVariable}}
```

A multiline variable can contain slot tags, which will be rendered recursively when the template is rendered.
```
{variableWithSlots}
This variable contains a slot which is defined in the outer scope: {{stringVariable}}
{/variableWithSlots}
```

## Parameters and Functions
A multiline variable can also be specified with parameters (which are required if no default is provided) which can be referenced using slots. Parameters are strings or numbers
```
{variableWithParameters(requiredParameter, optionalParameter="hello")}
{{requiredParameter}}
{{optionalParameter}}
{/variableWithParameters}
```

A slot or variable can be assigned the contents of a function, which is called using a function name and one or more parameters in parentheses.
```
// this will assign the output of add(2,2) to a variable called sumOfTwoNumbers
{sumOfTwoNumbers=add(2,2)}

// this will load file.ps.md and render it in place
{{load("file.ps.md")}}
```

There's a few basic functions defined in the `functions.ts` file and you can add your own using `registerFunction`.

#### Built-in Functions

By default, the `parser.ts` uses the contents of `functions.ts` as built-in functions. You can add your own custom functions with `registerFunction`.

- **add(a, b)**: Returns the sum of `a` and `b`.
```
// outputs 5
{{add(2, 3)}}
```

- **subtract(a, b)**: Returns the difference between `a` and `b`.
```
// outputs -1
{{subtract(2, 3)}}
```
- **multiply(a, b)**: Returns the product of `a` and `b`.

```
// outputs 6
{{multiply(2, 3)}}
```

- **divide(a, b)**: Returns the quotient of `a` divided by `b`. Throws an error when dividing by zero.
```
// outputs 2
{{divide(6, 3)}}
```

- **load(filePath)**: Loads a file from the specified path and renders its content.
```
// loads and renders the content of file.ps.md
{{load("file.ps.md")}}
```

- **loadDir(dirPath)**: Loads all files from the specified directory (and its subdirectories) that match certain extensions, and renders their contents. **Note**: The `loadDir` function uses the file extensions specified in the `--extensions` CLI option or the `PROMPT_SHAPER_FILE_EXTENSIONS` environment variable to determine which files to include. By default, it includes common text and code file extensions.
```
// loads and renders all files in the 'src' directory
{{loadDir("src")}}
```

- **loadUrl(url)**: Loads content from the specified URL and uses the [@mozilla/readability](https://github.com/mozilla/readability) library to convert it into readable text.
```
// loads and renders the Prompt Shaper GitHub page
{{loadUrl("https://github.com/PrajnaAvidya/prompt-shaper")}}
```


## String vs Number Parameters
The only difference between string and number params is that numeric params can have basic arithmetic operations done on their output. Supported operations are `+ - * / ^`.
```
{chapterTitle(chapterIndex)}
Chapter {{chapterIndex+1}}
{/chapterTitle}

// this will output "Chapter 1"
{{chapterTitle(chapterIndex=0)}}

// this will output "Chapter 0" because operators are ignored for string parameters.
{{chapterTitle(chapterIndex="0")}}
```

Strings must be double-quoted, and numbers are unquoted and can contain decimals.

## Misc
Comments are marked with double slashes `// this is a comment` or `/* mutliline style */` and are removed before rendering.

You can escape braces with backslashes so they won't be parsed as tags: `\{\{escapedSlot\}\}`

You can escape braces or double quotes in string parameters: `{{functionCall("param \" with \} special chars")}}`

## Template parsing/rendering order
1) remove comments
2) match and validate all variables and slots
3) remove variables
4) render slots with variable data from the bottom up
5) string variables will be parsed recursively (variables/slots within them will be rendered)
6) remove excess whitespace
