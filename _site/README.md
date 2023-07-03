Solve apple silicon issue:
```
─ sudo gem install bundler jekyll -- --with-ldflags="-Wl,-undefined,dynamic_lookup"
```