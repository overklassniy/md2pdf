# Security Policy

## Scope

md2pdf is a fully client-side application: all Markdown parsing, rendering,
and PDF export happen in the browser. There is no backend, no account system,
and no user data leaves the device.

Security issues in scope for this project include, for example:

- cross-site scripting through rendered Markdown or embedded HTML;
- unsafe handling of pasted or dropped files;
- service worker or caching flaws that serve unexpected content;
- vulnerabilities in the exported standalone HTML document.

Bugs in upstream dependencies are best reported to those projects directly;
report them here as well if md2pdf integrates them in an unsafe way.

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | Yes                |
| < 1.0   | No                 |

Only the latest release on the default branch receives security fixes.

## Reporting a vulnerability

Do not open a public GitHub issue for a security vulnerability.

Report privately through
[GitHub Security Advisories](https://github.com/overklassniy/md2pdf/security/advisories/new)
for this repository.

Include:

- a description of the vulnerability and its impact;
- steps to reproduce, with a sample Markdown document if relevant;
- the browser and version where you observed it;
- any suggested fix or mitigation, if you have one.

You can expect an initial response within a few days. If the report is
confirmed, a fix will be prepared and released before the issue is disclosed
publicly, and you will be credited in the advisory unless you prefer to
remain anonymous.
