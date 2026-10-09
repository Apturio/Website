# Flujo de trabajo (Gitflow)

## Ramas

| Rama | Para qué sirve | Se crea desde | Se mergea a |
|---|---|---|---|
| `main` | Producción. Cada commit es desplegable. | | |
| `develop` | Integración. Aquí se junta el trabajo listo. | `main` | |
| `feature/<tema>` | Una funcionalidad o mejora. | `develop` | `develop` |
| `release/<version>` | Preparar un despliegue: ajustes finales y QA. | `develop` | `main` y `develop` |
| `hotfix/<tema>` | Arreglo urgente en producción. | `main` | `main` y `develop` |

Nadie hace push directo a `main` ni a `develop`. Todo entra por Pull Request.

## Día a día

1. Actualiza: `git checkout develop && git pull`.
2. Crea tu rama: `git checkout -b feature/nombre-corto`.
3. Haz commits pequeños con mensajes `tipo(área): resumen` (`feat`, `fix`, `perf`, `docs`, `chore`).
4. Sube la rama y abre un PR hacia `develop`.
5. Mergea con **squash** y borra la rama.

## Desplegar a producción

1. `git checkout develop && git pull && git checkout -b release/AAAA-MM-DD`.
2. Corrige lo que salga en QA directamente en esa rama.
3. PR de `release/...` hacia `main`, merge con **merge commit** (no squash, así `main` conserva la historia).
4. Crea el tag: `git tag vX.Y.Z && git push --tags`.
5. PR de `main` hacia `develop` para devolver cualquier ajuste hecho en la release.

## Hotfix

1. `git checkout main && git pull && git checkout -b hotfix/nombre`.
2. Arregla, abre PR hacia `main` y mergea.
3. Abre otro PR de `main` hacia `develop` el mismo día.

## Reglas que evitan el desorden

- No dejes cambios sin commitear en `develop` ni en `main`. Si cambias de tarea, haz commit o `git stash`.
- Una rama, un tema. Si aparece algo no relacionado, otra rama.
- Antes de empezar trabajo nuevo, haz `git pull` en `develop`.
- Borra las ramas mergeadas (GitHub lo hace solo al mergear el PR).
- Archivos locales (`media/`, `.env`) no se commitean.
