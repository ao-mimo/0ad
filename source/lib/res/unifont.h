// $Id: unifont.h,v 1.5 2004/09/04 20:34:57 philip Exp $

#ifndef __UNIFONT_H__
#define __UNIFONT_H__

//#include "types.h"
#include "h_mgr.h"


// Load and return a handle to the font defined
// in fn+".fnt" with texture fn+".tga"
Handle unifont_load(const char* fn, int scope = RES_STATIC);

// Release a handle to a previously loaded font
int unifont_unload(Handle& h);

// Use the font referenced by h for all subsequent glwprintf() calls.
// Must be called before any glwprintf().
int unifont_bind(Handle h);

// Output text at current OpenGL modelview pos.
void glwprintf(const wchar_t* fmt, ...);

/*
  glwprintf assumes an environment roughly like:

	glEnable(GL_TEXTURE_2D);
	glDisable(GL_CULL_FACE);

	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	glEnable(GL_BLEND);
	glDisable(GL_ALPHA_TEST);

	glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
*/

// Intended for the GUI (hence ASCIIness). 'height' is roughly the height of
// a capital letter, for use when aligning text in an aesthetically pleasing way.
int unifont_stringsize(const Handle h, const char* text, int& width, int& height);

// Return spacing in pixels from one line of text to the next
int unifont_linespacing(const Handle h);

#endif // __UNIFONT_H__
