import { Rule,mergeWith,apply, url,applyTemplates,strings } from '@angular-devkit/schematics';
export default function(options: any): Rule{
  return mergeWith(
    apply(url('./files'),[
      applyTemplates({
        utils: strings,
        ...options,
        'dot': '.',
      }),
    ])
  )
}
