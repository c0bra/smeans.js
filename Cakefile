{exec} = require 'child_process'

findExecutable = (executable, callback) ->
  exec "test `which #{executable}` || echo 'Missing #{executable}'", (err, stdout, stderr) ->
    throw new Error(err) if err
    callback() if callback

build = (callback) ->
  exec 'mkdir lib', (err, stdout, stderr) ->
    # throw new Error(err) if err
    exec "coffee --compile --output lib/smeans.js smeans.coffee", (err, stdout, stderr) ->
      throw new Error(err) if err
      callback() if callback

test = (callback = console.log) ->
  exec "npm test", (err, stdout) ->
    callback(stdout)

publish = (callback = console.log) ->
  build ->
    findExecutable 'npm', ->
      exec 'npm publish', (err, stdout) ->
        callback(stdout)

dev_install = (callback = console.log) ->
  build ->
    findExecutable 'npm', ->
      exec 'npm link .', (err, stdout) ->
        callback(stdout)

task 'build', 'Build lib from src', -> build()
task 'test', 'Test project', -> test()
task 'publish', 'Publish project to npm', -> publish()
task 'dev-install', 'Install developer dependencies', -> dev_install()