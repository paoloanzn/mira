import jsdoc2md from "jsdoc-to-markdown";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate docs for a single file
async function generateDoc(inputFile) {
  // Create docs/api directory relative to project root
  const outputDir = path.join(__dirname, "root");
  const outputFile = path.join(
    outputDir,
    // Preserve directory structure
    path
      .relative(process.cwd(), inputFile)
      .replace(/^src\//, "") // Remove src/ prefix
      .replace(/\.(js|jsx)$/, ".md"),
  );

  try {
    const markdown = await jsdoc2md.render({ files: inputFile });

    // Skip files with no JSDoc content
    if (!markdown.trim()) {
      console.log(`No documentation found in ${inputFile}`);
      return;
    }

    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    // Add file header
    const relativeInputPath = path.relative(process.cwd(), inputFile);
    const header = `# ${path.basename(inputFile)}\n\nSource: \`${relativeInputPath}\`\n\n`;

    // Write the markdown
    await fs.writeFile(outputFile, header + markdown);
    console.log(`Generated documentation for ${relativeInputPath}`);
  } catch (error) {
    console.error(`Error generating documentation for ${inputFile}:`, error);
  }
}

// Generate index file
async function generateIndex(files) {
  const index = [
    "# Mira Documentation\n\n",
    "This documentation is automatically generated from JSDoc comments in the source code.\n\n",
    "## Contents\n\n",
  ];

  // Group files by directory
  const filesByDir = files.reduce((acc, file) => {
    const relativePath = path.relative(process.cwd(), file);
    const dir = path.dirname(relativePath).replace(/^src\//, "");
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(file);
    return acc;
  }, {});

  // Generate index content
  for (const [dir, dirFiles] of Object.entries(filesByDir)) {
    index.push(`### ${dir || "Root"}\n\n`);

    for (const file of dirFiles) {
      const relativePath = path.relative(process.cwd(), file);
      const docPath = path.join(
        "root",
        relativePath.replace(/^src\//, "").replace(/\.(js|jsx)$/, ".md"),
      );
      const displayName = path.basename(file);
      index.push(`- [${displayName}](${docPath.replace(/\\/g, "/")})`);
    }
    index.push("\n");
  }

  const indexPath = path.join(__dirname, "README.md");
  await fs.writeFile(indexPath, index.join("\n"));
  console.log("Generated documentation index");
}

// Generate docs for all JS/TS files
async function generateAllDocs() {
  try {
    // Ensure api directory exists
    const apiDir = path.join(__dirname, "api");
    await fs.mkdir(apiDir, { recursive: true });

    // Clean existing api directory
    await fs.rm(apiDir, { recursive: true, force: true });
    await fs.mkdir(apiDir, { recursive: true });

    // Get all JS files from src directory
    const files = await glob("./src/**/*.{js,jsx}", {
      ignore: ["**/node_modules/**", "**/dist/**", "**/docs/**", "**/tests/**"],
      absolute: true,
    });

    if (files.length === 0) {
      console.log("No JavaScript files found to document");
      return;
    }

    // Generate docs for each file
    await Promise.all(files.map(generateDoc));

    // Generate index
    await generateIndex(files);

    console.log("\nDocumentation generation completed successfully!");
    console.log(
      `Documentation can be found in ${path.join(__dirname, "root")}`,
    );
  } catch (error) {
    console.error("Error generating documentation:", error);
    process.exit(1);
  }
}

generateAllDocs();
