import * as shell from 'shelljs';

// copia todos las vistas
shell.cp('-R', 'src/views', 'dist/src/views');
shell.cp('-R', 'public', 'dist/public');