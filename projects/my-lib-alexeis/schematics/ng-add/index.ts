import { Rule, SchematicContext, Tree, SchematicsException  } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { virtualFs } from '@angular-devkit/core';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export function ngAdd(options: any): Rule {
  /*if (!options.directory) {
    // If scoped project (i.e. "@foo/bar"), convert directory to "foo/bar".
    options.directory = options.name.startsWith('@') ? options.name.slice(1) : options.name;
  }*/
  console.log(options)
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Adding library Module to the app....')
    const modulePath = '/src/app/app.module.ts';
    const routingPath = '/src/app/app.routes.ts';
    if(!tree.exists(modulePath)){
      throw new SchematicsException(`the file ${modulePath} doesn't exist...`);
    }
    const recorder = tree.beginUpdate(modulePath);

    const text = tree.read(modulePath);
    if(text === null){
      throw new SchematicsException(`the file ${modulePath} doesn't exist...`);
    }

    const source = ts.createSourceFile(
      modulePath,
      text.toString(),
      ts.ScriptTarget.Latest,
      true
    );

    const data = tree.read(routingPath);
    if (!data) {
      throw new SchematicsException('File not found.');
    }

    if(!tree.exists('/src/environment/aplicacion.ts')){
      tree.overwrite('/src/environment/aplicacion.ts', archivos.dataApp);
    }else{
      tree.create('/src/environment/aplicacion.ts', archivos.dataApp);
    }
    if(tree.exists('/src/environment/environment.ts')){
      tree.overwrite('/src/environment/environment.ts', archivos.dataEnv);
    }else{
      tree.create('/src/environment/environment.ts', archivos.dataEnv);
    }

    if(tree.exists('/src/app/app.routes.ts')){
      tree.overwrite('/src/app/app.routes.ts', archivos.routesApp);
    }else{
      tree.create('/src/app/app.routes.ts', archivos.dataEnv);
    }
    if(tree.exists('/src/app/app.component.ts')){
      tree.overwrite('/src/app/app.component.ts', archivos.componentApp);
    }else{
      tree.create('/src/app/app.component.ts', archivos.componentApp);
    }
    if(tree.exists('/src/app/app.component.html')) {
      tree.overwrite('/src/app/app.component.html', archivos.componentHTML);
    }else {
      tree.create('/src/app/app.component.html', archivos.componentHTML);
    }



    const archivoString = virtualFs.fileBufferToString(data);

    console.log(archivoString)

    applyToUpdateRecorder(recorder,
      addImportToModule(source, modulePath, 'MyLibAlexeisComponent','my-lib-alexeis')
    );
    // const templateSource = apply(url('./src/environments'), [
    //   move('./files/','./src/environments')
    // ])

    //console.log(templateSource);
    tree.commitUpdate(recorder);

    context.logger.info('Installing dependencies.....')
    //context.addTask(new RunSchematicTask())
    context.addTask(new NodePackageInstallTask({

    }))
    //return chain([mergeWith(templateSource)]);
  }
}


export const archivos = {
  dataApp: `import { AplicacionDto } from "ruat-componentes";

  export const aplicacion:AplicacionDto = {
    codigoAplicacion: {
      menu: '2',
      controlVersion: '1000'
    },
    codigoSubsistema: 'GESUSR',
    nombre: 'Gestión de Usuarios',
    tenant: 'default'
  };
  `,
  dataEnv: `export const environment = {
    production: false,
    codigoAplicacion: '2',
    apiProxy: 'http://localhost:8001',
    keycloak: {
      url: 'http://172.21.43.72:9080' + '/auth',
      realm: 'regusuario-prototipo',
      clientId: 'registrousuario-angular'
    }
  };
  `,
  routesApp: `import { Routes } from '@angular/router';
  import { InicioComponent, AdminWrapperComponent } from 'ruat-dashboard';

  export const routes: Routes = [
    {
      path: '', component: AdminWrapperComponent,
      children: [
        {
          path: '', component: InicioComponent
        }
      ]
    }
  ];
  `,
  componentApp: `
  import { APP_INITIALIZER, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AutorizacionService, MaterialRuatModule, SesionService } from 'ruat-componentes';
import { aplicacion } from '../environments/aplicacion';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KeycloakAngularModule,HttpClientModule, MaterialRuatModule],
  providers:[
    AutorizacionService,
    { provide: 'APLICACION', useValue: aplicacion },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    SesionService,
    { provide: 'AMBIENTE', useValue: environment },
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';
}
`,
  componentHTML: `
  <router-outlet />
  `
}
